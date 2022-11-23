import { doc, getDoc } from 'firebase/firestore'
import { Component, createResource, createSignal, For, Show } from 'solid-js'

import { db } from '../backend/init'
import { User, UserDataDb } from '../model'
import { leftDrawerOpen, setLeftDrawerOpen, user } from '../state'
import { AddIcon, Button, CloseIcon, Drawer, IconButton, List, TextField } from '../styleguide'
import Category from './Category'
import styles from './LeftDrawer.module.css'
import Site from './Site'

const fetchData = async (user: User) => {
  const userId = user.id
  if (!userId) {
    throw new Error('missing userId')
  }

  const docRef = doc(db, 'subscriptions', userId);
  const querySnapshot = await getDoc(docRef);
  const data = querySnapshot.data() as UserDataDb
  return data
}

const LeftDrawer: Component = () => {
  const [data] = createResource(user, fetchData);

  const [searchTerm, setSearchTerm] = createSignal('')

  const getSitesThatMatchSearchTerm = () => data()?.sites
    .concat(data()?.categories.flatMap(({ sites }) => sites) || [])
    .filter(({ title }) =>
      title.toLowerCase().includes(searchTerm().toLowerCase()))

  return (
    <Drawer open={leftDrawerOpen()} anchor="left" onClose={() => setLeftDrawerOpen(false)}>
      <div class={styles.leftDrawerInner}>
        <div class={styles.closeButtonWrapper}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setLeftDrawerOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div class={styles.content}>
          <div class={styles.search}>
            <TextField
              id="search-box"
              label="Search sites by name"
              variant="outlined"
              value={searchTerm()}
              onChange={e => setSearchTerm(e.currentTarget.value)}
              fullWidth
            />
          </div>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
          >
            add category
          </Button>

          <div class={styles.subscriptions}>
            <Show when={!searchTerm()}>
              <List>
                <For each={data()?.categories}>
                  {(category, i) => <Category category={category} />}
                </For>
              </List>

              <List>
                <For each={data()?.sites}>
                  {(site, i) => <Site site={site} />}
                </For>
              </List>
            </Show>

            <Show when={searchTerm()}>
              <List>
                <For each={getSitesThatMatchSearchTerm()}>
                  {(site, i) => <Site site={site} />}
                </For>
              </List>
            </Show>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default LeftDrawer
