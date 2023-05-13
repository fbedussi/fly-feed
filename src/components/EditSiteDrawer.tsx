import {Component, createSignal} from 'solid-js'

import {
  Button,
  Checkbox,
  CloseIcon,
  DeleteIcon,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Snackbar,
  TextField
} from '../styleguide'
import styles from './EditSiteDrawer.module.css'
import {useGetSubscriptions, useSetSubscriptions} from '../primitives/db';
import {useSearchParams} from '@solidjs/router';
import {setSiteToEdit, siteToEdit} from '../state';
import {SiteDb} from '../model';

const EditSiteDrawer: Component = () => {
  const [, setSearchParams] = useSearchParams();

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  const [deletedSite, setDeletedSite] = createSignal<SiteDb & { categoryId?: string } | null>(null)

  const updateSite = () => {
    const siteToEditData = siteToEdit()
    if (!siteToEditData) {
      throw new Error('missing siteToEdit')
    }

    if (!subscriptionsQuery.data) {
      throw new Error('no subscriptionsQuery.data')
    }

    const newSite = {
      id: siteToEditData.id,
      title: siteToEditData.title,
      xmlUrl: siteToEditData.xmlUrl,
      htmlUrl: siteToEditData.htmlUrl,
      muted: siteToEditData.muted || false,
      deleted: false,
      errorTimestamps: [],
      starred: false,
    }

    const isNewSite = !subscriptionsQuery.data.categories
      .find(({id}) => id === siteToEditData.categoryId)?.sites
      .some(({id}) => id === siteToEditData.id)

    const updatedData = isNewSite
      ? {
        ...subscriptionsQuery.data,
        categories: subscriptionsQuery.data.categories.map(category => category.id === siteToEditData.categoryId
          ? {
            ...category,
            sites: category.sites.concat(newSite)
          }
          : category)
      }
      : {
        ...subscriptionsQuery.data,
        categories: subscriptionsQuery.data.categories.map(category => category.id === siteToEditData.categoryId
          ? {
            ...category,
            sites: category.sites.map(site => site.id === siteToEditData.id
              ? {
                ...site,
                title: siteToEditData.title,
                xmlUrl: siteToEditData.xmlUrl,
                htmlUrl: siteToEditData.htmlUrl,
                muted: siteToEditData.muted,
              }
              : site
            )
          }
          : category)
      }
    subscriptionsQuery.data && mutation.mutate(updatedData)

    setSiteToEdit(null)
  }

  const setDeleted = ({
                        categoryId,
                        siteId,
                        deleted,
                      }: {
    categoryId?: string,
    siteId?: string,
    deleted: boolean,
  }) => {
    if (!subscriptionsQuery.data) {
      throw new Error('no subscriptionsQuery.data')
    }

    return {
      ...subscriptionsQuery.data,
      categories: subscriptionsQuery.data.categories.map(category => category.id === categoryId
        ? {
          ...category,
          sites: category.sites.map(site => site.id === siteId
            ? {
              ...site,
              deleted,
            }
            : site)
        }
        : category)
    }
  }

  const deleteSite = () => {
    if (!subscriptionsQuery.data) {
      return
    }

    const categoryId = siteToEdit()?.categoryId
    const siteId = siteToEdit()?.id
    const updatedData = setDeleted({
      categoryId,
      siteId,
      deleted: true,
    })

    mutation.mutate(updatedData)

    setDeletedSite(siteToEdit())

    setSiteToEdit(null)

    setSearchParams({site: undefined}, {replace: true})
  }


  const undeleteSite = () => {
    if (!subscriptionsQuery.data) {
      return
    }

    const categoryId = deletedSite()?.categoryId
    const siteId = deletedSite()?.id
    const updatedData = setDeleted({
      categoryId,
      siteId,
      deleted: false,
    })
    mutation.mutate(updatedData)

    setSearchParams({site: undefined}, {replace: true})
  }

  let nameInputRef: HTMLInputElement

  return (
    <>
      <Drawer open={!!siteToEdit()} anchor="top" onClose={() => setSiteToEdit(null)}>
        <div class={styles.topDrawerInner}>
          <div class={styles.closeButtonWrapper}>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{mr: 2}}
              onClick={() => setSiteToEdit(null)}
            >
              <CloseIcon/>
            </IconButton>
          </div>

          <form class={styles.content} onSubmit={e => {
            e.preventDefault()

            <TextField
              inputRef={ref => {
                nameInputRef = ref
              }}
              onFocus={() => nameInputRef.select()}
              label="name"
              value={siteToEdit()?.title || ''}
              onChange={e => {
                const siteToEditData = siteToEdit()
                siteToEditData && setSiteToEdit({ ...siteToEditData, title: e.currentTarget.value })
              }}
            />
            <div class={styles.muteAndDelete}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={siteToEdit()?.muted || false} onChange={e => {
                    const siteToEditData = siteToEdit()
                    siteToEditData && setSiteToEdit({
                      ...siteToEditData,
                      muted: e.currentTarget.checked
                    });
                  }}/>} label="Mute"/>
              </FormGroup>
              <Button
                color="warning"
                startIcon={<DeleteIcon/>}
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSite()
                }}
              >
                delete
              </Button>
            </div>
            <div class={styles.buttons}>
              <Button variant="text" onClick={() => setSiteToEdit(null)}>cancel</Button>
              <Button variant="contained" type="submit">save</Button>
            </div>
          </form>
        </div>
      </Drawer>
      <Snackbar
        open={!!deletedSite()}
        message={`Site ${deletedSite()?.title} deleted`}
        onClose={() => {
          setDeletedSite(null)
        }}
        action={<Button variant="text" onClick={() => {
          undeleteSite()
          setDeletedSite(null)
        }}>undo</Button>}
      />
    </>
  );
}

export default EditSiteDrawer
