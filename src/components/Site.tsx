import { Component } from 'solid-js'
import { SiteDb } from '../model'
import { Badge, ListItem, ListItemButton, ListItemText } from '../styleguide'

type Props = {
  site: SiteDb
  sx?: Record<string, any>
}

const Site: Component<Props> = (props) => {
  return (
    <ListItem disablePadding sx={props.sx}>
      <ListItemButton>
        <Badge badgeContent={4} color="primary">
          <ListItemText primary={props.site.title} />
        </Badge>
      </ListItemButton>
    </ListItem>
  )
}

export default Site
