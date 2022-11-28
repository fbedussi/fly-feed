import { Component, createSignal, For, Show } from 'solid-js'

import { leftDrawerOpen, setLeftDrawerOpen } from '../state'
import { AddIcon, ClearIcon, CloseIcon, Drawer, IconButton, List, TextField, Typography } from '../styleguide'
import Category from './Category'
import styles from './LeftDrawer.module.css'
import Site from './Site'
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions'
import shortid from 'shortid'
import { useSearchParams } from '@solidjs/router';
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db';
import { onSwipe } from '../libs/swipe';

const LeftDrawer: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = createSignal('')

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  const getSitesThatMatchSearchTerm = () => useGetSitesFromSubscriptions(subscriptionsQuery.data)
    .filter(({ title }) =>
      title.toLowerCase().includes(searchTerm().toLowerCase()))

  // https://www.solidjs.com/guides/typescript#use___
  false && onSwipe

  return (
    <Drawer open={leftDrawerOpen()} anchor="left" onClose={() => setLeftDrawerOpen(false)} >
      <div class={styles.leftDrawerInner} use:onSwipe={(direction) => {
        if (direction === 'left') {
          setLeftDrawerOpen(false)
        }
      }}>
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
            <div>
              <IconButton onClick={() => setSearchTerm('')}>
                <ClearIcon />
              </IconButton>
            </div>
          </div>

          <div class={styles.subscriptions}>
            <Show when={!searchTerm()}>
              <Typography variant="h6" gutterBottom component="div" class={styles.title}>
                <span>Categories</span>
                <IconButton>
                  <AddIcon onClick={() => {
                    const newCategoryId = shortid.generate()

                    subscriptionsQuery.data && mutation.mutate({
                      ...subscriptionsQuery.data,
                      categories: [{
                        id: newCategoryId,
                        name: 'new category',
                        sites: [],
                      }, ...subscriptionsQuery.data.categories],
                    })

                    setSearchParams({ ...searchParams, category: newCategoryId }, { replace: true })
                  }} />
                </IconButton>
              </Typography>
              <List>
                <For each={subscriptionsQuery.data?.categories}>
                  {(category, i) => <Category category={category} />}
                </For>
              </List>

              <Typography variant="h6" gutterBottom component="div" class={styles.title}>
                <span>Sites</span>
                <IconButton>
                  <AddIcon onClick={() => {
                    subscriptionsQuery.data && mutation.mutate(({
                      ...subscriptionsQuery.data,
                      sites: [{
                        id: shortid.generate(),
                        title: 'new site',
                        xmlUrl: '',
                        htmlUrl: '',
                        starred: false,
                        errorTimestamps: [],
                      }, ...subscriptionsQuery.data.sites]
                    }))
                  }} />
                </IconButton>
              </Typography>
              <List>
                <For each={subscriptionsQuery.data?.sites}>
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
    </Drawer >
  );
}

export default LeftDrawer
