import { Component, createEffect, createSignal } from 'solid-js'

import { Button, Checkbox, CloseIcon, DeleteIcon, Drawer, FormControlLabel, FormGroup, IconButton, Snackbar, TextField } from '../styleguide'
import styles from './EditCategoryDrawer.module.css'
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db';
import { useSearchParams } from '@solidjs/router';
import { categoryToEdit, setCategoryToEdit } from '../state';
import { CategoryDb } from '../model';

const EditSiteDrawer: Component = () => {
  const [, setSearchParams] = useSearchParams();

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  const [name, setName] = createSignal('')
  const [muted, setMuted] = createSignal(false)

  createEffect(() => {
    const category = categoryToEdit()
    if (category) {
      setName(category.name)
      setMuted(category.muted || false)
    }
  })

  const [deletedCategory, setDeletedCategory] = createSignal<CategoryDb | null>(null)

  const updateCateogry = () => {
    const cat = categoryToEdit()
    if (!subscriptionsQuery.data || !cat) {
      return
    }

    const isNewCategory = !subscriptionsQuery.data.categories.some(category => category.id === cat.id)

    const updatedCategories = isNewCategory
      ? [{
        ...cat,
        name: name(),
        muted: muted(),
      } as CategoryDb].concat(subscriptionsQuery.data.categories)
      : subscriptionsQuery.data.categories.map(category => category.id === cat.id
        ? {
          ...category,
          name: name(),
          muted: muted(),
        }
        : category)

    const updatedData = {
      ...subscriptionsQuery.data,
      categories: updatedCategories,
    }

    mutation.mutate(updatedData)

    setCategoryToEdit(null)
  }

  const deleteCategory = () => {
    if (!subscriptionsQuery.data) {
      return
    }

    const categoryId = categoryToEdit()?.id
    mutation.mutate({
      ...subscriptionsQuery.data,
      categories: subscriptionsQuery.data.categories.map(category => category.id === categoryId
        ? {
          ...category,
          deleted: true,
        }
        : category)
    })

    setDeletedCategory(categoryToEdit())

    setCategoryToEdit(null)

    setSearchParams({ site: undefined }, { replace: true })
  }

  const undeleteCategory = () => {
    subscriptionsQuery.data && mutation.mutate({
      ...subscriptionsQuery.data,
      categories: subscriptionsQuery.data.categories.map(category => category.id === deletedCategory()?.id
        ? {
          ...category,
          deleted: false,
        }
        : category)
    })
    setDeletedCategory(null)
  }

  return (
    <>
      <Drawer open={!!categoryToEdit()} anchor="top" onClose={() => setCategoryToEdit(null)} >
        <div class={styles.topDrawerInner}>
          <div class={styles.closeButtonWrapper}>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setCategoryToEdit(null)}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <form class={styles.content} onSubmit={e => {
            e.preventDefault()
            updateCateogry()
          }}>
            <TextField label="name" value={name()} onChange={e => setName(e.currentTarget.value)} />

            <div class={styles.muteAndDelete}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={muted()} onChange={e => setMuted(!muted())} />} label="Mute" />
              </FormGroup>
              <Button
                color="warning"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCategory()
                }}
              >
                delete
              </Button>
            </div>

            <div class={styles.buttons}>
              <Button variant="text" onClick={() => setCategoryToEdit(null)}>cancel</Button>
              <Button variant="contained" type="submit">save</Button>
            </div>
          </form>
        </div>
      </Drawer>
      <Snackbar
        open={!!deletedCategory()}
        message={`Categroy ${deletedCategory()?.name} deleted`}
        onClose={() => {
          setDeletedCategory(null)
        }}
        action={<Button variant="text" onClick={() => undeleteCategory()}>undo</Button>}
      />
    </>
  );
}

export default EditSiteDrawer
