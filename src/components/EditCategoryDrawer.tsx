import { Component, createSignal } from 'solid-js'

import {
  Button,
  Checkbox,
  CloseIcon,
  DeleteIcon,
  FormControlLabel,
  FormGroup,
  IconButton,
  Snackbar,
  TextField,
} from '../styleguide'
import styles from './EditCategoryDrawer.module.css'
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db'
import { useSearchParams } from '@solidjs/router'
import { categoryToEdit, setCategoryToEdit } from '../state'
import { CategoryDb } from '../model'
import TopDrawer from './TopDrawer'

const EditSiteDrawer: Component = () => {
  const [, setSearchParams] = useSearchParams()

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  const [deletedCategory, setDeletedCategory] = createSignal<CategoryDb | null>(null)

  const updateCategory = () => {
    const cat = categoryToEdit()
    if (!subscriptionsQuery.data || !cat) {
      return
    }

    const isNewCategory = !subscriptionsQuery.data.categories.some(
      category => category.id === cat.id,
    )

    const updatedCategories = isNewCategory
      ? [cat].concat(subscriptionsQuery.data.categories)
      : subscriptionsQuery.data.categories.map(category =>
          category.id === cat.id ? cat : category,
        )

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
      categories: subscriptionsQuery.data.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              deleted: true,
            }
          : category,
      ),
    })

    setDeletedCategory(categoryToEdit())

    setCategoryToEdit(null)

    setSearchParams({ site: undefined }, { replace: true })
  }

  const undeleteCategory = () => {
    subscriptionsQuery.data &&
      mutation.mutate({
        ...subscriptionsQuery.data,
        categories: subscriptionsQuery.data.categories.map(category =>
          category.id === deletedCategory()?.id
            ? {
                ...category,
                deleted: false,
              }
            : category,
        ),
      })
    setDeletedCategory(null)
  }

  let nameInputRef: HTMLInputElement

  return (
    <>
      <TopDrawer open={!!categoryToEdit()} onClose={() => setCategoryToEdit(null)}>
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

          <form
            class={styles.content}
            onSubmit={e => {
              e.preventDefault()
              updateCategory()
            }}
          >
            <TextField
              label="name"
              inputRef={ref => {
                nameInputRef = ref
              }}
              onFocus={() => nameInputRef.select()}
              value={categoryToEdit()?.name || ''}
              onChange={e => {
                const cat = categoryToEdit()
                cat && setCategoryToEdit({ ...cat, name: e.currentTarget.value })
              }}
            />

            <div class={styles.muteAndDelete}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={categoryToEdit()?.muted}
                      onChange={e => {
                        const cat = categoryToEdit()
                        cat && setCategoryToEdit({ ...cat, muted: !categoryToEdit()?.muted })
                      }}
                    />
                  }
                  label="Mute"
                />
              </FormGroup>
              <Button
                color="warning"
                startIcon={<DeleteIcon />}
                onClick={e => {
                  e.stopPropagation()
                  deleteCategory()
                }}
              >
                delete
              </Button>
            </div>

            <div class={styles.buttons}>
              <Button variant="text" onClick={() => setCategoryToEdit(null)}>
                cancel
              </Button>
              <Button variant="contained" type="submit">
                save
              </Button>
            </div>
          </form>
        </div>
      </TopDrawer>

      <Snackbar
        open={!!deletedCategory()}
        message={`Category ${deletedCategory()?.name} deleted`}
        onClose={() => {
          setDeletedCategory(null)
        }}
        action={
          <Button
            variant="text"
            onClick={() => {
              undeleteCategory()
              setDeletedCategory(null)
            }}
          >
            undo
          </Button>
        }
      />
    </>
  )
}

export default EditSiteDrawer
