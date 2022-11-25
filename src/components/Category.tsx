import { Component, createSignal, For, Show } from 'solid-js';
import { CategoryDb } from '../model';
import { AddIcon, Badge, DeleteIcon, EditIcon, FolderIcon, FolderOpenIcon, IconButton, List, ListItem, ListItemButton, ListItemText } from '../styleguide';
import Collapse from '../styleguide/Collapse';
import Site from './Site';
import { useSearchParams } from '@solidjs/router'

import styles from './Category.module.css'
import { articles } from '../state';
type Props = {
  category: CategoryDb
}

const Category: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = () => {
    const categoryIdOpened = searchParams.category
    return categoryIdOpened === props.category.id
  }

  const getNumberOfNewArticles = () => articles().filter(({ categoryId }) => categoryId === props.category.id).length

  return (
    <ListItem disablePadding sx={{
      flexDirection: 'column',
      alignItems: 'start',
      border: 'solid 1px lightgray'
    }}>
      <ListItemButton
        onClick={() => {
          if (searchParams.category === props.category.id) {
            setSearchParams({ ...searchParams, category: undefined }, { replace: true })
          } else {
            setSearchParams({ ...searchParams, category: props.category.id }, { replace: true })
          }
        }}
        sx={{
          backgroundColor: isOpen() ? '#777' : 'transparent',
          color: isOpen() ? 'white' : 'inherit',
        }}
        class={styles.categoryButton}
      >
        {isOpen() ? <FolderOpenIcon /> : <FolderIcon />}
        <Badge badgeContent={getNumberOfNewArticles()} color="primary">
          <ListItemText primary={props.category.name} />
        </Badge>
        <div class={styles.buttons}>
          <Show when={isOpen()}>
            <IconButton size="small" >
              <AddIcon />
            </IconButton>
            <IconButton size="small" >
              <EditIcon />
            </IconButton>
            <IconButton size="small" >
              <DeleteIcon />
            </IconButton>
          </Show>
        </div>
      </ListItemButton>

      <Collapse in={isOpen()} >
        <List component="div" disablePadding>
          <For each={props.category.sites}>
            {(site, i) => <Site site={site} />}
          </For>
        </List>
      </Collapse>
    </ListItem>
  )
}

export default Category
