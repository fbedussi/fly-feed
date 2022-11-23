import { Component } from 'solid-js'
import { SiteDb } from '../model'
import { Badge, ListItem, ListItemButton, ListItemText } from '../styleguide'
import { useSearchParams } from '@solidjs/router'

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
      </ListItemButton>
    </ListItem>
  )
}

export default Site
