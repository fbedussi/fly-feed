import { Component, createEffect, createSignal } from 'solid-js'

import { Button, Checkbox, CloseIcon, DeleteIcon, Drawer, FormControlLabel, FormGroup, IconButton, TextField } from '../styleguide'
import styles from './EditCategoryDrawer.module.css'
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db';
import { useSearchParams } from '@solidjs/router';
import { categoryToEdit, setCategoryToEdit } from '../state';

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

  return (
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

          subscriptionsQuery.data && mutation.mutate({
            ...subscriptionsQuery.data,
            categories: subscriptionsQuery.data.categories.map(category => category.id === categoryToEdit()?.id
              ? {
                ...category,
                name: name(),
                muted: muted(),
              }
              : category),
          })

          setCategoryToEdit(null)
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

                if (!subscriptionsQuery.data) {
                  return
                }

                const categoryId = categoryToEdit()?.id
                mutation.mutate({
                  ...subscriptionsQuery.data,
                  categories: subscriptionsQuery.data.categories.filter(category => category.id !== categoryId)
                })

                setSearchParams({ site: undefined }, { replace: true })
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
  );
}

export default EditSiteDrawer
