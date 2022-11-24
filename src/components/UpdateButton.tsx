import { Component } from 'solid-js'
import { Article, FetchKo, FetchOk } from '../model'
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions'
import { useGetSubscriptions } from '../primitives/useGetSubscriptions'
import { setArticles } from '../state'

import { AutorenewIcon, Fab } from '../styleguide'

const UpdateButton: Component = () => {
  const [data] = useGetSubscriptions()

  return (
    <Fab color="primary" sx={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
    }}
      onClick={async () => {
        const substriptions = data()
        const sites = useGetSitesFromSubscriptions(substriptions)
        const sitesToFetch = sites.filter(({ xmlUrl }) => xmlUrl).slice(2, 3)

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
        sessionStorage.setItem('fly-feed-updates', JSON.stringify({ updatedAt: new Date().toISOString(), articles }))
      }}
    >
      <AutorenewIcon />
    </Fab>
  )
}

export default UpdateButton
