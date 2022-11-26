import { createSignal, ResourceReturn } from 'solid-js'
import { createStore } from 'solid-js/store';

import { Article, SubscriptionsDb, User } from './model'

export const [user, setUser] = createSignal<User | null | undefined>(undefined);

export const [leftDrawerOpen, setLeftDrawerOpen] = createSignal(false);

export const [rightDrawerOpen, setRightDrawerOpen] = createSignal(false);

export const [articles, setArticles] = createSignal<{
  categoryId: string,
  siteId: string,
  isNew: boolean,
  article: Article
}[]>([]);

export const [subscriptions, setSubscriptions] = createStore<SubscriptionsDb & { draft?: boolean }>({
  sites: [],
  categories: [],
})

