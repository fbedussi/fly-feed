import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createEffect, createResource } from 'solid-js';
import { db } from '../backend/init';
import { SubscriptionsDb, User } from '../model';
import { setSubscriptions, subscriptions, user } from '../state';

const COLLECTION_NAME = 'subscriptions'

const fetchData = async (user: User) => {
  const userId = user.id
  const docRef = doc(db, COLLECTION_NAME, userId);
  const querySnapshot = await getDoc(docRef);
  const data = querySnapshot.data() as SubscriptionsDb
  return data
}

export const useGetSubscriptions = () => {
  return createResource(user, fetchData);
}

export const useSetSubscriptions = () => {
  createEffect(async () => {
    const userId = user()?.id
    if (!userId) {
      throw new Error('missing user id')
    }
    if (subscriptions.draft) {
      await setDoc(doc(db, COLLECTION_NAME, userId), {
        sites: subscriptions.sites,
        categories: subscriptions.categories,
      })
      setSubscriptions({ ...subscriptions, draft: false })
    }
  })
  return createResource(user, fetchData);
}

