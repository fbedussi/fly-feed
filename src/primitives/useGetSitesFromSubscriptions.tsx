import {SiteDb, SubscriptionsDb} from '../model'

const addCategoryIdToSite = <S extends SiteDb>(site: S, categoryId: string) => ({
  ...site,
  categoryId,
})

export const useGetSitesFromSubscriptions = (subscriptions?: SubscriptionsDb, excludeMutedCategories = false) => {
  return subscriptions?.categories
    .filter(category => excludeMutedCategories ? !category.muted : true)
    .flatMap(({id, sites}) => sites
      .map(site => addCategoryIdToSite(site, id))
    ) || []
}
