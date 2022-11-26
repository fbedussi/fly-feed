import { Component, createSignal } from 'solid-js'
import { Article, FetchKo, FetchOk } from '../model'
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions'
import { articles, MAX_ERRORS, setArticles, setSubscriptions, subscriptions } from '../state'

import { AutorenewIcon, Fab } from '../styleguide'
import openDb from '../cache';

const UpdateButton: Component = () => {
  const [updating, setUpdating] = createSignal(false)

  return (
    <Fab color="primary" sx={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
    }}
      onClick={async () => {
        setUpdating(true)

        const sites = useGetSitesFromSubscriptions(subscriptions)
        const sitesToFetch = sites
          .filter(({ xmlUrl, errorTimestamps }) => {
            const lastErrorIsoDate = errorTimestamps.at(-1)
            const lastErrorTimestamp = lastErrorIsoDate && new Date(lastErrorIsoDate).getTime()
            const oneDay = 1000 * 60 * 60 * 24
            const recentError = !!lastErrorTimestamp && (Date.now() - lastErrorTimestamp) < oneDay
            return !!xmlUrl && !recentError && errorTimestamps.length < MAX_ERRORS
          })

        const updates = await Promise.all(
          sitesToFetch
            .map(async ({ categoryId, id, xmlUrl }) => {
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

        const newArticles = updates.filter(isOk).flat()
        const errors = updates.filter(isKo)

        if (errors.length) {
          setSubscriptions('categories', ({ id }) => errors.some(({ categoryId }) => categoryId === id), category => {
            return {
              ...category,
              sites: category.sites.map(site => {
                const errorTimstamp = errors.find(({ siteId }) => siteId === site.id)?.errorTimestamp
                return {
                  ...site,
                  errorTimestamps: errorTimstamp ? site.errorTimestamps.concat(errorTimstamp) : site.errorTimestamps,
                }
              })
            }
          })
          setSubscriptions('sites', ({ id }) => errors.some(({ siteId }) => siteId === id), site => {
            const errorTimstamp = errors.find(({ siteId }) => siteId === site.id)?.errorTimestamp
            return {
              ...site,
              errorTimestamps: errorTimstamp ? site.errorTimestamps.concat(errorTimstamp) : site.errorTimestamps,
            }
          })
          setSubscriptions('draft', true)
        }

        const oldArticles = articles()
        setArticles(newArticles.map(newArticle => ({
          ...newArticle,
          isNew: !oldArticles.find(oldArticle => oldArticle.siteId === newArticle.siteId && oldArticle.article.title === newArticle.article.title)
        })))
        setUpdating(false)
        openDb().then((db: any) => db.saveCache({ updatedAt: new Date().toISOString(), articles: newArticles }))
      }}
    >
      <AutorenewIcon sx={{
        animationName: updating() ? 'spin' : 'none',
        animationDuration: '3000ms',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      }} />
    </Fab>
  )
}

export default UpdateButton
