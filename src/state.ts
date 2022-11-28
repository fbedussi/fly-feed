import { createSignal } from 'solid-js'

import { Article, SiteDb, User } from './model'

export const [user, setUser] = createSignal<User | null | undefined>(undefined);

export const [leftDrawerOpen, setLeftDrawerOpen] = createSignal(false);

export const [rightDrawerOpen, setRightDrawerOpen] = createSignal(false);

export const [articles, setArticles] = createSignal<{
  categoryId: string,
  siteId: string,
  isNew: boolean,
  article: Article
}[]>([]);

export const [siteToEdit, setSiteToEdit] = createSignal<SiteDb & { categoryId?: string } | null>(null)

export const MAX_ERRORS = 10

export const [showScrollToTop, setShowScrollToTop] = createSignal(false)

export const [scrollToTop, setScrollToTop] = createSignal(false)
