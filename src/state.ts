import { createSignal } from 'solid-js'

import { Article, User } from './model'

export const [user, setUser] = createSignal<User | null | undefined>(undefined);

export const [leftDrawerOpen, setLeftDrawerOpen] = createSignal(false);

export const [rightDrawerOpen, setRightDrawerOpen] = createSignal(false);

export const [articles, setArticles] = createSignal<{ categoryId: string, siteId: string, article: Article }[]>([]);

