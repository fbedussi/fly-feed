import { Component, Show } from 'solid-js'
import { SiteDb } from '../model'
import { Badge, DeleteIcon, EditIcon, IconButton, ListItem, ListItemButton, ListItemText } from '../styleguide'
import { useSearchParams } from '@solidjs/router'

import styles from './Site.module.css'

type Props = {
  site: SiteDb
  sx?: Record<string, any>
}

const Site: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isSelected = () => {
    const siteIdSelected = searchParams.site
    return siteIdSelected === props.site.id
  }

  return (
    <ListItem disablePadding sx={{
      ...props.sx,
      backgroundColor: isSelected() ? '#ccc' : 'inherit',
    }}>
      <ListItemButton onClick={() => setSearchParams({ ...searchParams, site: props.site.id }, { replace: true })}>
        <Badge badgeContent={4} color="primary">
          <ListItemText primary={props.site.title} />
        </Badge>

        <div class={styles.buttons}>
          <Show when={isSelected()}>
            <IconButton size="small" sx={{ color: 'white' }}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white' }}>
              <DeleteIcon />
            </IconButton>
          </Show>
        </div>
      </ListItemButton>
    </ListItem>
  )
}

export default Site
