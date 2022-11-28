import { createMutation, createQuery, useQueryClient } from '@tanstack/solid-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../backend/init';
import { SiteDb, SubscriptionsDb } from '../model';
import { user } from '../state';

const COLLECTION_NAME = 'subscriptions'
const TAG = 'subscriptions'

const upgradeSiteSchema = (site: SiteDb) => ({
  ...site,
  muted: site.muted === undefined ? false : site.muted,
  deleted: site.deleted === undefined ? false : site.deleted,
})

const fetchData = async (userId?: string) => {
  if (!userId) {
    return
  }
  const docRef = doc(db, COLLECTION_NAME, userId);
  const querySnapshot = await getDoc(docRef);
  const data = querySnapshot.data() as SubscriptionsDb

  return data
  // return {
  //   sites: data.sites.map(upgradeSiteSchema),
  //   categories: data.categories.map(category => ({
  //     ...category,
  //     sites: category.sites.map(upgradeSiteSchema),
  //   }))
  // }
}

export const useGetSubscriptions = () => {
  const query = createQuery({
    queryKey: () => [TAG],
    queryFn: () => fetchData(user()?.id),
    enabled: !!user()?.id,
  })

  return query
}

const mutateData = async (userId: string, subscriptions: SubscriptionsDb) => {
  return await setDoc(doc(db, COLLECTION_NAME, userId), {
    sites: subscriptions.sites,
    categories: subscriptions.categories,
  })
}

export const useSetSubscriptions = () => {
  const queryClient = useQueryClient()

  const userId = user()?.id || ''

  const mutation = createMutation({
    mutationFn: (subscriptions: SubscriptionsDb) => mutateData(userId, subscriptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAG] })
    }
  })

  return mutation
}

