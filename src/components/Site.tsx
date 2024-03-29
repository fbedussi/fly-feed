import { Component, Show } from 'solid-js'
import { SiteDb } from '../model'
import {
  Badge,
  EditIcon,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  UpdateDisabledIcon,
  LinkIcon,
} from '../styleguide'
import { useSearchParams } from '@solidjs/router'

import styles from './Site.module.css'
import { articles, MAX_ERRORS, setSiteToEdit } from '../state'
import { useSetSubscriptions } from '../primitives/db'

type Props = {
  site: SiteDb
  categoryId?: string
  sx?: Record<string, any>
}

const Site: Component<Props> = props => {
  const [searchParams, setSearchParams] = useSearchParams()

  const isSelected = () => {
    const siteIdSelected = searchParams.site
    return siteIdSelected === props.site.id
  }

  const getNumberOfNewArticles = () =>
    articles().filter(({ isNew, siteId }) => isNew && siteId === props.site.id).length

  const mutation = useSetSubscriptions()

  return (
    <ListItem
      disablePadding
      sx={{
        ...props.sx,
        backgroundColor: isSelected() ? '#ccc' : 'inherit',
      }}
    >
      {mutation.isLoading ? (
        <div class={styles.progressContainer}>
          <LinearProgress />
        </div>
      ) : (
        <ListItemButton
          sx={{
            width: '100%',
            gap: '0.5rem',
            opacity: props.site.muted ? 0.5 : 1,
          }}
          onClick={e => {
            if (searchParams.site === props.site.id) {
              setSearchParams({ ...searchParams, site: undefined }, { replace: true })
            } else {
              setSearchParams(
                { ...searchParams, site: props.site.id, category: props.categoryId },
                { replace: true },
              )
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
              draggable
              onDragStart={e => {
                e.dataTransfer &&
                  e.dataTransfer.setData(
                    'text/plain',
                    JSON.stringify({
                      site: props.site,
                      categoryId: props.categoryId,
                    }),
                  )
              }}
              primary={
                <div class={styles.siteNameAndLink}>
                  <span>{props.site.title} </span>
                  <a href={props.site.htmlUrl} target="_blank">
                    <LinkIcon />
                  </a>
                </div>
              }
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
                onClick={e => {
                  e.stopPropagation()

                  setSiteToEdit({ ...props.site, categoryId: props.categoryId })
                }}
              >
                <EditIcon />
              </IconButton>
            </Show>
          </div>
        </ListItemButton>
      )}
    </ListItem>
  )
}

export default Site
