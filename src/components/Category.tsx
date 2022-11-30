import { Component, createSignal, For, Show, createEffect } from 'solid-js';
import { CategoryDb } from '../model';
import { AddIcon, Badge, DeleteIcon, EditIcon, FolderIcon, FolderOpenIcon, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, SaveIcon, UpdateDisabledIcon } from '../styleguide';
import Collapse from '../styleguide/Collapse';
import Site from './Site';
import { useSearchParams } from '@solidjs/router'

import styles from './Category.module.css'
import { articles, setCategoryToEdit } from '../state';
import shortid from 'shortid';
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db';
type Props = {
  category: CategoryDb & { draft?: boolean }
}

const Category: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = () => {
    const categoryIdOpened = searchParams.category
    return categoryIdOpened === props.category.id
  }

  const getNumberOfNewArticles = () => articles()
    .filter(({ isNew, categoryId }) => isNew && categoryId === props.category.id)
    .length

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  return (
    <ListItem disablePadding sx={{
      flexDirection: 'column',
      alignItems: 'start',
      border: 'solid 1px lightgray'
    }}>
      {mutation.isLoading
        ? (
          <div class={styles.progressContainer}>
            <LinearProgress />
          </div>
        )
        : (
          <ListItemButton
            onClick={() => {
              if (searchParams.category === props.category.id) {
                setSearchParams({ ...searchParams, category: undefined }, { replace: true })
              } else {
                setSearchParams({ ...searchParams, category: props.category.id, site: undefined }, { replace: true })
              }
            }}
            classList={{ [styles.open]: isOpen() }}
            class={styles.categoryButton}
            sx={{
              opacity: props.category.muted ? 0.5 : 1,
            }}
          >
            {isOpen() ? <FolderOpenIcon /> : <FolderIcon />}

            {props.category.muted && <UpdateDisabledIcon />}


            <Badge
              badgeContent={getNumberOfNewArticles()}
              color="primary"
              sx={{ maxWidth: isOpen() ? 'calc(100% - 10rem)' : 'calc(100% - 3rem)' }}
            >
              <ListItemText primary={props.category.name} class="textEllipsis" />
            </Badge>

            <div class={styles.buttons}>
              <Show when={isOpen()}>
                <IconButton size="small" >
                  <AddIcon onClick={(e) => {
                    e.stopPropagation()

                    subscriptionsQuery.data && mutation.mutate(({
                      ...subscriptionsQuery.data,
                      categories: subscriptionsQuery.data.categories.map(category => category.id === props.category.id
                        ? {
                          id: category.id,
                          name: category.name,
                          sites: category.sites.concat({
                            id: shortid.generate(),
                            title: 'new site',
                            xmlUrl: '',
                            htmlUrl: '',
                            starred: false,
                            errorTimestamps: [],
                          })
                        }
                        : category)
                    }))
                  }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setCategoryToEdit(props.category)
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Show>
            </div>
          </ListItemButton>
        )
      }

      <Collapse in={isOpen()} >
        <List component="div" disablePadding>
          <For each={props.category.sites}>
            {(site, i) => <Site site={site} categoryId={props.category.id} />}
          </For>
        </List>
      </Collapse>
    </ListItem>
  )
}

export default Category
