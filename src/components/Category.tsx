import { Component, createSignal, For, Show, createEffect } from 'solid-js';
import { CategoryDb } from '../model';
import { AddIcon, Badge, DeleteIcon, EditIcon, FolderIcon, FolderOpenIcon, IconButton, List, ListItem, ListItemButton, ListItemText, SaveIcon } from '../styleguide';
import Collapse from '../styleguide/Collapse';
import Site from './Site';
import { useSearchParams } from '@solidjs/router'

import styles from './Category.module.css'
import { articles, setSubscriptions } from '../state';
import shortid from 'shortid';
type Props = {
  category: CategoryDb
}

const Category: Component<Props> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEditing, setIsEditing] = createSignal(props.category.name === 'new category')

  const isOpen = () => {
    const categoryIdOpened = searchParams.category
    return categoryIdOpened === props.category.id
  }

  const getNumberOfNewArticles = () => articles().filter(({ categoryId }) => categoryId === props.category.id).length

  let inputEl: HTMLInputElement | undefined
  createEffect(() => {
    if (isEditing()) {
      inputEl?.select()
    }
  })

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
        classList={{ [styles.open]: isOpen() }}
        class={styles.categoryButton}
      >
        {isOpen() ? <FolderOpenIcon /> : <FolderIcon />}
        {isEditing()
          ? <input ref={inputEl} type="text" value={props.category.name} onBlur={(e) => {
            setSubscriptions('categories', category => category.id === props.category.id, prev => ({ ...prev, name: e.currentTarget.value }))
            setIsEditing(false)
          }} />
          : (
            <Badge badgeContent={getNumberOfNewArticles()} color="primary">
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
                setSubscriptions('categories', category => category.id === props.category.id, prev => ({
                  ...prev, sites: prev.sites.concat({
                    id: shortid.generate(),
                    title: 'new site',
                    xmlUrl: '',
                    htmlUrl: '',
                    starred: false,
                    errorTimestamps: [],
                  })
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
                setSubscriptions('categories', prev => prev.filter(({ id }) => id !== props.category.id))
                setSearchParams({ category: undefined }, { replace: true })
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Show>
        </div>
      </ListItemButton>

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
