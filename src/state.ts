import { createSignal } from 'solid-js'

import { User } from './model'

export const [user, setUser] = createSignal<User | null | undefined>(undefined);

export const [leftDrawerOpen, setLeftDrawerOpen] = createSignal(false);

export const [rightDrawerOpen, setRightDrawerOpen] = createSignal(false);

