import {Component, createSignal, For, Show} from 'solid-js'

import {leftDrawerOpen, setCategoryToEdit, setLeftDrawerOpen} from '../state'
import {AddIcon, ClearIcon, CloseIcon, IconButton, List, TextField, Typography} from '../styleguide'
import Category from './Category'
import styles from './LeftDrawer.module.css'
import Site from './Site'
import {useGetSitesFromSubscriptions} from '../primitives/useGetSitesFromSubscriptions'
import shortid from 'shortid'
import {useGetSubscriptions} from '../primitives/db';
import {onSwipe} from '../libs/swipe';

const LeftDrawer: Component = () => {
  const [searchTerm, setSearchTerm] = createSignal('')

  const subscriptionsQuery = useGetSubscriptions()

  const getSitesThatMatchSearchTerm = () => useGetSitesFromSubscriptions(subscriptionsQuery.data)
    .filter(({title}) =>
      title.toLowerCase().includes(searchTerm().toLowerCase()))

  // https://www.solidjs.com/guides/typescript#use___
  false && onSwipe

  return (
    <>
      <div class={[styles.overlay, leftDrawerOpen() ? styles.isOpen : ''].join(' ')}
           onClick={() => setLeftDrawerOpen(false)}
      />
      <div class={[styles.leftDrawer, leftDrawerOpen() ? styles.isOpen : ''].join(' ')}>

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
              sx={{mr: 2}}
              onClick={() => setLeftDrawerOpen(false)}
            >
              <CloseIcon/>
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
                  <ClearIcon/>
                </IconButton>
              </div>
            </div>

            <div class={styles.subscriptions}>
              <Show when={!searchTerm()}>
                <Typography variant="h6" gutterBottom component="div" class={styles.title}>
                  <span>Categories</span>
                  <IconButton>
                    <AddIcon onClick={() => {
                      const newCategory = {
                        id: shortid.generate(),
                        name: 'new category',
                        sites: [],
                      }

                      setCategoryToEdit(newCategory)
                    }}/>
                  </IconButton>
                </Typography>
                <List>
                  <For each={subscriptionsQuery.data?.categories.filter(({deleted}) => !deleted)}>
                    {(category) => <Category category={category}/>}
                  </For>
                </List>
              </Show>

              <Show when={searchTerm()}>
                <List>
                  <For each={getSitesThatMatchSearchTerm()}>
                    {(site) => <Site site={site}/>}
                  </For>
                </List>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftDrawer
