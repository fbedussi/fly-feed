import {Component, createSignal} from 'solid-js'
import {Article, FetchKo, FetchOk} from '../model'
import {useGetSitesFromSubscriptions} from '../primitives/useGetSitesFromSubscriptions'
import {articles, MAX_ERRORS, setArticles, setScrollToTop, showScrollToTop} from '../state'

import {AutorenewIcon, Fab, KeyboardArrowUpIcon} from '../styleguide'
import openDb from '../cache';
import {useGetSubscriptions, useSetSubscriptions} from '../primitives/db'

const sanitizeContent = (content = '') => {
  const images = content.match(/<img.+>/g) || undefined

  const sanitizedContent = content
    .replace(/<script.+script>/g, '')
    .replace(/<img.+>/g, '')

  return {
    content: sanitizedContent,
    images,
  }
}
const UpdateButton: Component = () => {
  const [updating, setUpdating] = createSignal(false)

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  return (
    <Fab color="primary" sx={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
    }}
         onClick={async () => {

           if (showScrollToTop()) {
             setScrollToTop(true)
             return
           }

           setUpdating(true)

           const sites = useGetSitesFromSubscriptions(subscriptionsQuery.data, true)
           const sitesToFetch = sites
             .filter(({xmlUrl, errorTimestamps}) => {
               const lastErrorIsoDate = errorTimestamps.at(-1)
               const lastErrorTimestamp = lastErrorIsoDate && new Date(lastErrorIsoDate).getTime()
               const oneDay = 1000 * 60 * 60 * 24
               const recentError = !!lastErrorTimestamp && (Date.now() - lastErrorTimestamp) < oneDay
               return !!xmlUrl && !recentError && errorTimestamps.length < MAX_ERRORS
             })

           const updates = await Promise.all(
             sitesToFetch
               .map(async ({categoryId, id, xmlUrl}) => {
                 try {
                   const request = await fetch(`https://rss2json.fbedussi.now.sh/?url=${xmlUrl}`)
                   const feed = await request.json() as { items: Omit<Article, 'starred'>[] }
                   return feed.items.map(article => ({
                     categoryId,
                     siteId: id,
                     article: {
                       ...article,
                       starred: false,
                     },
                   })) as FetchOk[]
                 } catch (e) {
                   return {
                     categoryId,
                     siteId: id,
                     errorTimestamp: new Date().toISOString(),
                   } as FetchKo
                 }
               })
           )

           const isOk = (update: FetchOk[] | FetchKo): update is FetchOk[] => Array.isArray(update)
           const isKo = (update: FetchOk[] | FetchKo): update is FetchKo => !Array.isArray(update)

           const newArticles = updates.filter(isOk).flat().map(articleData => ({
             ...articleData,
             article: {
               ...articleData.article,
               ...sanitizeContent(articleData.article.content),
             },
           }))
           const errors = updates.filter(isKo)

           if (errors.length && subscriptionsQuery.data) {
             mutation.mutate({
               ...subscriptionsQuery.data,
               categories: subscriptionsQuery.data.categories
                 .map(category => errors.some(({categoryId}) => categoryId === category.id)
                   ? {
                     ...category,
                     sites: category.sites.map(site => {
                       const errorTimstamp = errors.find(({siteId}) => siteId === site.id)?.errorTimestamp
                       return {
                         ...site,
                         errorTimestamps: errorTimstamp ? site.errorTimestamps.concat(errorTimstamp) : site.errorTimestamps,
                       }
                     })
                   }
                   : category),
             })
           }

           const oldArticles = articles()
           setArticles(newArticles.map(newArticle => ({
             ...newArticle,
             isNew: !oldArticles.find(oldArticle => oldArticle.siteId === newArticle.siteId && oldArticle.article.title === newArticle.article.title)
           })))
           setUpdating(false)
           openDb().then((db: any) => db.saveCache({updatedAt: new Date().toISOString(), articles: newArticles}))
         }}
    >
      {
        showScrollToTop()
          ? < KeyboardArrowUpIcon/>
          : <AutorenewIcon sx={{
            animationName: updating() ? 'spin' : 'none',
            animationDuration: '3000ms',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}/>}
    </Fab>
  )
}

export default UpdateButton
