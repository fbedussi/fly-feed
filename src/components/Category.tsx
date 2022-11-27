import { Component, createSignal, For, Show, createEffect } from 'solid-js';
import { CategoryDb } from '../model';
import { AddIcon, Badge, DeleteIcon, EditIcon, FolderIcon, FolderOpenIcon, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, SaveIcon } from '../styleguide';
import Collapse from '../styleguide/Collapse';
import Site from './Site';
import { useSearchParams } from '@solidjs/router'

import styles from './Category.module.css'
import { articles } from '../state';
import shortid from 'shortid';
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db';
type Props = {
  category: CategoryDb & { draft?: boolean }
}

const Category: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEditing, setIsEditing] = createSignal(props.category.draft)

  const isOpen = () => {
    const categoryIdOpened = searchParams.category
    return categoryIdOpened === props.category.id
  }

  const getNumberOfNewArticles = () => articles()
    .filter(({ isNew, categoryId }) => isNew && categoryId === props.category.id)
    .length

  let inputEl: HTMLInputElement | undefined
  createEffect(() => {
    if (isEditing()) {
      inputEl?.select()
    }
  })

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
          >
            {isOpen() ? <FolderOpenIcon /> : <FolderIcon />}
            {isEditing()
              ? <input ref={inputEl} type="text" value={props.category.name} onBlur={(e) => {
                subscriptionsQuery.data && mutation.mutate({
                  ...subscriptionsQuery.data,
                  categories: subscriptionsQuery.data.categories.map(category => category.id === props.category.id
                    ? {
                      id: category.id,
                      name: e.currentTarget.value,
                      sites: category.sites
                    }
                    : category
                  )
                })
                setIsEditing(false)
              }} />
              : (
                <Badge
                  badgeContent={getNumberOfNewArticles()}
                  color="primary"
                  sx={{ maxWidth: isOpen() ? 'calc(100% - 10rem)' : 'calc(100% - 3rem)' }}
                >
                  <ListItemText primary={props.category.name} class="textEllipsis" />
                </Badge>
              )}
            <div class={styles.buttons}>
              {isEditing() && (
                <IconButton size="small">
                  <SaveIcon />
                </IconButton>
              )}
              <Show when={isOpen() && !isEditing()}>
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
                    setIsEditing(true)
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()

                    subscriptionsQuery.data && mutation.mutate({
                      ...subscriptionsQuery.data,
                      categories: subscriptionsQuery.data.categories.filter(category => category.id !== props.category.id)
                    })

                    setSearchParams({ category: undefined }, { replace: true })
                  }}
                >
                  <DeleteIcon />
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
