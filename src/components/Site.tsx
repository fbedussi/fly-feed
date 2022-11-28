import { Component, Show } from 'solid-js'
import { SiteDb } from '../model'
import { Badge, DeleteIcon, EditIcon, IconButton, LinearProgress, ListItem, ListItemButton, ListItemText, UpdateDisabledIcon } from '../styleguide'
import { useSearchParams } from '@solidjs/router'

import styles from './Site.module.css'
import { articles, MAX_ERRORS, setSiteToEdit } from '../state'
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db'

type Props = {
  site: SiteDb
  categoryId?: string
  sx?: Record<string, any>
}

const Site: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isSelected = () => {
    const siteIdSelected = searchParams.site
    return siteIdSelected === props.site.id
  }

  const getNumberOfNewArticles = () => articles()
    .filter(({ isNew, siteId }) => isNew && siteId === props.site.id)
    .length

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  return (
    <ListItem disablePadding sx={{
      ...props.sx,
      backgroundColor: isSelected() ? '#ccc' : 'inherit',
    }}>
      {mutation.isLoading
        ? (
          <div class={styles.progressContainer}>
            <LinearProgress />
          </div>
        )
        : (
          <ListItemButton
            sx={{
              width: '100%',
              gap: '0.5rem',
              opacity: props.site.muted ? 0.5 : 1,
            }}

            onClick={(e) => {
              if (searchParams.site === props.site.id) {
                setSearchParams({ ...searchParams, site: undefined }, { replace: true })
              } else {
                setSearchParams({ ...searchParams, site: props.site.id, category: props.categoryId }, { replace: true })
              }
            }}
          >
            {props.site.muted && <UpdateDisabledIcon />}
            <Badge
              badgeContent={getNumberOfNewArticles()}
              color="primary"
              sx={{ maxWidth: isSelected() ? 'calc(100% - 5rem)' : 'calc(100% - 1rem)' }}
            >
              <ListItemText
                primary={props.site.title}
                classList={{
                  textEllipsis: true,
                  [styles.withErrors]: !!props.site.errorTimestamps.length,
                  [styles.withPermanentErrors]: props.site.errorTimestamps.length >= MAX_ERRORS,
                }}
              />
            </Badge>

            <div class={styles.buttons}>
              <Show when={isSelected()}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()

                    setSiteToEdit({ ...props.site, categoryId: props.categoryId })
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation()

                  if (!subscriptionsQuery.data) {
                    return
                  }

                  if (props.categoryId) {
                    mutation.mutate({
                      ...subscriptionsQuery.data,
                      categories: subscriptionsQuery.data.categories.map(category => category.id === props.categoryId
                        ? {
                          ...category,
                          sites: category.sites.filter(site => site.id !== props.site.id)
                        }
                        : category)
                    })
                  } else {
                    mutation.mutate({
                      ...subscriptionsQuery.data,
                      sites: subscriptionsQuery.data.sites.filter(({ id }) => id !== props.site.id)
                    })
                  }

                  setSearchParams({ site: undefined }, { replace: true })
                }}>
                  <DeleteIcon />
                </IconButton>
              </Show>
            </div>
          </ListItemButton>
        )}
    </ListItem>
  )
}

export default Site
