import { SiteDb, SubscriptionsDb } from '../model'

const addCategoryIdToSite = <S extends SiteDb>(site: S, categoryId: string) => ({
  ...site,
  categoryId,
})

export const useGetSitesFromSubscriptions = (subscriptions?: SubscriptionsDb) => {
  const sitesWithoutCategory = (subscriptions?.sites || []).map(site => addCategoryIdToSite(site, ''))

  const sitesInCategories = subscriptions?.categories
    .flatMap(({ id, sites }) => sites
      .map(site => addCategoryIdToSite(site, id))
    ) || []

  return sitesWithoutCategory.concat(sitesInCategories)
}
