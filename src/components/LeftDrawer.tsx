import { Component, createSignal, For, Show } from 'solid-js'

import { leftDrawerOpen, setLeftDrawerOpen, user } from '../state'
import { AddIcon, Button, CloseIcon, Drawer, IconButton, List, TextField } from '../styleguide'
import Category from './Category'
import styles from './LeftDrawer.module.css'
import Site from './Site'
import { useGetSubscriptions } from '../primitives/useGetSubscriptions';
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions'

const LeftDrawer: Component = () => {
  const [data] = useGetSubscriptions()

  const [searchTerm, setSearchTerm] = createSignal('')

  const getSitesThatMatchSearchTerm = () => useGetSitesFromSubscriptions(data())
    .filter(({ title }) =>
      title.toLowerCase().includes(searchTerm().toLowerCase()))

  return (
    <Drawer open={leftDrawerOpen()} anchor="left" onClose={() => setLeftDrawerOpen(false)}>
      <div class={styles.leftDrawerInner}>
        <div class={styles.closeButtonWrapper}>
          <IconButton
            size="large"
            edge="start"
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
