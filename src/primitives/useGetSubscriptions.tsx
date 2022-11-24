import { doc, getDoc } from 'firebase/firestore';
import { createResource } from 'solid-js';
import { db } from '../backend/init';
import { SubscriptionsDb } from '../model';
import { user } from '../state';

const fetchData = async () => {
  const userId = user()?.id
  if (!userId) {
    throw new Error('missing userId')
  }

  const docRef = doc(db, 'subscriptions', userId);
  const querySnapshot = await getDoc(docRef);
  const data = querySnapshot.data() as SubscriptionsDb
  return data
}

export const useGetSubscriptions = () => {
  return createResource(user, fetchData);
}
