import { createMutation, createQuery, useQueryClient } from '@tanstack/solid-query'
import { arrayRemove, arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../backend/init'
import { Article, SavedArticle, SubscriptionsDb } from '../model'
import { user } from '../state'
import openDb from '../cache'

const SUBSCRIPTIONS_COLLECTION_NAME = 'subscriptions'
const SUBSCRIPTIONS_TAG = 'subscriptions'

const getSubscriptions = async (userId?: string) => {
  if (!userId) {
    return
  }
  const docRef = doc(db, SUBSCRIPTIONS_COLLECTION_NAME, userId)
  const querySnapshot = await getDoc(docRef)
  return querySnapshot.data() as SubscriptionsDb
}

export const useGetSubscriptions = () => {
  return createQuery({
    queryKey: () => [SUBSCRIPTIONS_TAG],
    queryFn: () => getSubscriptions(user()?.id),
    enabled: !!user()?.id,
  })
}

const setSubscriptions = async (userId: string, subscriptions: SubscriptionsDb) => {
  return await setDoc(doc(db, SUBSCRIPTIONS_COLLECTION_NAME, userId), {
    categories: subscriptions.categories,
  })
}

export const useSetSubscriptions = () => {
  const queryClient = useQueryClient()

  const userId = user()?.id || ''

  return createMutation({
    mutationFn: (subscriptions: SubscriptionsDb) => setSubscriptions(userId, subscriptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_TAG] })
    },
  })
}

const ARTICLES_COLLECTION_NAME = 'articles'
const ARTICLES_TAG = 'articles'

const getArticlesCachedOnDevice = async (): Promise<SavedArticle[]> => {
  const db = await openDb()
  const cachedDataParsed = await db.readCache<{ articles: SavedArticle[] } | null>()

  return cachedDataParsed ? cachedDataParsed.articles : []
}

const getSavedArticles = async (userId?: string) => {
  if (!userId) {
    throw new Error('missing user id')
  }
  const articlesCachedOnDevice = await getArticlesCachedOnDevice()

  const docRef = doc(db, ARTICLES_COLLECTION_NAME, userId)
  const querySnapshot = await getDoc(docRef)
  const savedArticles = ((querySnapshot.data()?.articles || []) as SavedArticle[]).map(article => ({
    ...article,
    saved: true,
  }))

  const articlesMap = articlesCachedOnDevice
    // since savedArticles are last they will override corresponding cached articles
    .concat(savedArticles)
    .reduce((result, savedArticle) => {
      result[savedArticle.article.link] = savedArticle
      return result
    }, {} as Record<string, SavedArticle>)

  return Object.values(articlesMap)
}

export const useGetSavedArticles = () => {
  return createQuery({
    queryKey: () => [ARTICLES_TAG],
    queryFn: () => getSavedArticles(user()?.id),
    enabled: !!user()?.id,
  })
}

const prepareArticleDataForDb = (
  articleData: SavedArticle,
): {
  categoryId: string
  siteId: string
  article: Article & { saved: true }
} => ({
  categoryId: articleData.categoryId,
  siteId: articleData.siteId,
  article: {
    ...articleData.article,
    images: articleData.article.images || [],
    saved: true,
  },
})

const saveArticle = async (userId: string, articleData: SavedArticle) => {
  return await setDoc(doc(db, ARTICLES_COLLECTION_NAME, userId), {
    articles: arrayUnion(prepareArticleDataForDb(articleData)),
  })
}

const deleteArticle = async (userId: string, articleData: SavedArticle) => {
  return await setDoc(doc(db, ARTICLES_COLLECTION_NAME, userId), {
    articles: arrayRemove(prepareArticleDataForDb(articleData)),
  })
}

export const useSaveArticle = () => {
  const queryClient = useQueryClient()

  return createMutation({
    mutationFn: (article: SavedArticle) => {
      const userId = user()?.id
      if (!userId) {
        throw new Error('missing user id')
      }
      return saveArticle(userId, article)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_TAG] })
    },
  })
}

export const useDeleteArticle = () => {
  const queryClient = useQueryClient()

  return createMutation({
    mutationFn: (article: SavedArticle) => {
      const userId = user()?.id
      if (!userId) {
        throw new Error('missing user id')
      }
      return deleteArticle(userId, article)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_TAG] })
    },
  })
}
