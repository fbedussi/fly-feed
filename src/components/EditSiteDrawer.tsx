import { Component, createEffect, createSignal } from 'solid-js'

import { Button, Checkbox, CloseIcon, DeleteIcon, Drawer, FormControlLabel, FormGroup, IconButton, TextField } from '../styleguide'
import styles from './EditSiteDrawer.module.css'
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db';
import { useSearchParams } from '@solidjs/router';
import { setSiteToEdit, siteToEdit } from '../state';

const EditSiteDrawer: Component = () => {
  const [, setSearchParams] = useSearchParams();

  const subscriptionsQuery = useGetSubscriptions()
  const mutation = useSetSubscriptions()

  const [title, setTitle] = createSignal('')
  const [xmlUrl, setXmlUrl] = createSignal('')
  const [htmlUrl, setHtmlUrl] = createSignal('')
  const [muted, setMuted] = createSignal(false)

  createEffect(() => {
    const site = siteToEdit()
    if (site) {
      setTitle(site.title)
      setXmlUrl(site.xmlUrl)
      setHtmlUrl(site.htmlUrl)
      setMuted(site.muted || false)
    }
  })

  return (
    <Drawer open={!!siteToEdit()} anchor="top" onClose={() => setSiteToEdit(null)} >
      <div class={styles.topDrawerInner}>
        <div class={styles.closeButtonWrapper}>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSiteToEdit(null)}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <form class={styles.content} onSubmit={e => {
          e.preventDefault()

          if (siteToEdit()?.categoryId) {
            subscriptionsQuery.data && mutation.mutate({
              ...subscriptionsQuery.data,
              categories: subscriptionsQuery.data.categories.map(category => category.id === siteToEdit()?.categoryId
                ? {
                  ...category,
                  sites: category.sites.map(site => site.id === siteToEdit()?.id
                    ? {
                      ...site,
                      title: title(),
                      xmlUrl: xmlUrl(),
                      htmlUrl: htmlUrl(),
                      muted: muted(),
                    }
                    : site
                  )
                }
                : category)
            })
          } else {
            subscriptionsQuery.data && mutation.mutate({
              ...subscriptionsQuery.data,
              sites: subscriptionsQuery.data.sites.map(site => site.id === siteToEdit()?.id
                ? {
                  ...site,
                  title: title(),
                  xmlUrl: xmlUrl(),
                  htmlUrl: htmlUrl(),
                  muted: muted(),
                }
                : site),
            })
          }

          setSiteToEdit(null)
        }}>
          <TextField label="name" value={title()} onChange={e => setTitle(e.currentTarget.value)} />
          <TextField label="rss link" value={xmlUrl()} onChange={e => setXmlUrl(e.currentTarget.value)} />
          <TextField label="web link" value={htmlUrl()} onChange={e => setHtmlUrl(e.currentTarget.value)} />
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

              const categoryId = siteToEdit()?.categoryId
              const siteId = siteToEdit()?.id
              if (categoryId) {
                mutation.mutate({
                  ...subscriptionsQuery.data,
                  categories: subscriptionsQuery.data.categories.map(category => category.id === categoryId
                    ? {
                      ...category,
                      sites: category.sites.filter(site => site.id !== siteId)
                    }
                    : category)
                })
              } else {
                mutation.mutate({
                  ...subscriptionsQuery.data,
                  sites: subscriptionsQuery.data.sites.filter(({ id }) => id !== siteId)
                })
              }

              setSearchParams({ site: undefined }, { replace: true })
            }}
          >
            delete
          </Button>
          <div class={styles.buttons}>
            <Button variant="text" onClick={() => setSiteToEdit(null)}>cancel</Button>
            <Button variant="contained" type="submit">save</Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default EditSiteDrawer
