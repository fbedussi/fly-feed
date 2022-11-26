import { Component, createEffect, createSignal, Show } from 'solid-js'
import { SiteDb } from '../model'
import { Badge, DeleteIcon, EditIcon, IconButton, ListItem, ListItemButton, ListItemText, SaveIcon } from '../styleguide'
import { useSearchParams } from '@solidjs/router'

import styles from './Site.module.css'
import { articles, setSubscriptions } from '../state'

type Props = {
  site: SiteDb
  categoryId?: string
  sx?: Record<string, any>
}

const Site: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEditing, setIsEditing] = createSignal(props.site.title === 'new site')

  let inputEl: HTMLInputElement | undefined
  createEffect(() => {
    if (isEditing()) {
      inputEl?.select()
    }
  })

  const isSelected = () => {
    const siteIdSelected = searchParams.site
    return siteIdSelected === props.site.id
  }

  const getNumberOfNewArticles = () => articles()
    .filter(({ isNew, siteId }) => isNew && siteId === props.site.id)
    .length

  return (
    <ListItem disablePadding sx={{
      ...props.sx,
      backgroundColor: isSelected() ? '#ccc' : 'inherit',
    }}>
      <ListItemButton
        sx={{ width: '100%' }}
        onClick={() => {
          if (searchParams.site === props.site.id) {
            setSearchParams({ ...searchParams, site: undefined }, { replace: true })
          } else {
            setSearchParams({ ...searchParams, site: props.site.id }, { replace: true })
          }
        }}
      >
        {isEditing()
          ? <input ref={inputEl} type="text" value={props.site.title} onBlur={(e) => {
            if (!props.categoryId) {
              setSubscriptions('sites', site => site.id === props.site.id, prev => ({ ...prev, title: e.currentTarget.value }))
            } else {
              setSubscriptions('categories', category => category.id === props.categoryId, category => ({
                ...category,
                sites: category.sites.map(site => site.id === props.site.id ? { ...site, title: e.currentTarget.value } : site)
              }))
            }
            setSubscriptions('draft', true)
            setIsEditing(false)
          }} />
          : (
            <Badge
              badgeContent={getNumberOfNewArticles()}
              color="primary"
              sx={{ maxWidth: isSelected() ? 'calc(100% - 5rem)' : 'calc(100% - 1rem)' }}
            >
              <ListItemText primary={props.site.title} class="textEllipsis" />
            </Badge>
          )}

        <div class={styles.buttons}>
          {isEditing() && (
            <IconButton size="small">
              <SaveIcon />
            </IconButton>
          )}
          <Show when={isSelected() && !isEditing()}>
            <IconButton
              size="small"
              onClick={(e) => {
                setIsEditing(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={(e) => {
              e.stopPropagation()
              if (!props.categoryId) {
                setSubscriptions('sites', prev => prev.filter(({ id }) => id !== props.site.id))
              } else {
                setSubscriptions('categories', category => category.id === props.categoryId, category => ({
                  ...category,
                  sites: category.sites.filter(site => site.id !== props.site.id)
                }))
              }
              setSubscriptions('draft', true)
              setSearchParams({ site: undefined }, { replace: true })
            }}>
              <DeleteIcon />
            </IconButton>
          </Show>
        </div>
      </ListItemButton>
    </ListItem>
  )
}

export default Site
