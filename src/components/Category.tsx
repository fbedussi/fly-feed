import { Component, createSignal, For } from 'solid-js';
import { CategoryDb } from '../model';
import { Badge, ExpandLessIcon, ExpandMoreIcon, List, ListItem, ListItemButton, ListItemText } from '../styleguide';
import Collapse from '../styleguide/Collapse';
import Site from './Site';

type Props = {
  category: CategoryDb
}

const Category: Component<Props> = (props) => {
  const [open, setOpen] = createSignal(false)
  return (
    <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'start' }}>
      <ListItemButton onClick={() => setOpen(!open())} sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Badge badgeContent={4} color="primary">
          <ListItemText primary={props.category.name} />
        </Badge>
        {open() ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open()} >
        <List component="div" disablePadding>
          <For each={props.category.sites}>
            {(site, i) => <Site site={site} sx={{ pl: 4 }} />}
          </For>
        </List>
      </Collapse>
    </ListItem>
  )
}

export default Category
