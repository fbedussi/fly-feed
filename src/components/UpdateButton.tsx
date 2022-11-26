import { Component, createSignal } from 'solid-js'
import { Article, FetchKo, FetchOk } from '../model'
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions'
import { setArticles, subscriptions } from '../state'

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
        const sitesToFetch = sites.filter(({ xmlUrl }) => xmlUrl)

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

        const articles = updates.filter(isOk).flat()
        const errors = updates.filter(isKo)

        // TODO: save errors to subscriptions

        setArticles(articles)
        setUpdating(false)
        openDb().then((db: any) => db.saveCache({ updatedAt: new Date().toISOString(), articles }))
      }}
    >
      <AutorenewIcon sx={{
        animationName: updating() ? 'spin' : 'none',
        animationDuration: '5000ms',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      }} />
    </Fab>
  )
}

export default UpdateButton
