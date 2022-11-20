import {
  collection, getDocs, query,
  where
} from 'firebase/firestore'
import {
  Accessor, Component, createResource,
  createSignal, For
} from 'solid-js'

import { db } from '../backend/init'
import { logoutBe } from '../backend/login'
import { User, UserDataDb } from '../model'
import {
  leftDrawerOpen, rightDrawerOpen, setLeftDrawerOpen,
  setRightDrawerOpen, setUser, user
} from '../state'
import {
  AddIcon, Button, CloseIcon,
  Drawer, FileDownloadIcon, FileUploadIcon,
  IconButton, Modal, Paper,
  SettingsIcon, TextField, Typography
} from '../styleguide'
import LogoutModal from './LogoutModal'
import styles from './RightDrawer.module.css'
import ImportButton from './ImportButton'

const logout =
  () =>
    logoutBe()
      .then(() => {
        setUser(null)
      })
      .catch(error => {
        // notificationsActions.addNotification({
        //   type: 'error',
        //   messageLabelKey: error.message,
        //   id: error.message,
        // }),
        alert(error.message)
      })

const RightDrawer: Component = () => {
  const [openLogoutModal, setOpenLogoutModal] = createSignal(false);

  return (
    <>
      <LogoutModal open={openLogoutModal} handleClose={() => setOpenLogoutModal(false)} />

      <div class={[styles.overlay, rightDrawerOpen() ? styles.isOpen : ''].join(' ')}
        onClick={() => setRightDrawerOpen(false)}
      />
      <div class={[styles.rightDrawer, rightDrawerOpen() ? styles.isOpen : ''].join(' ')}>
        <div class={styles.closeButtonWrapper}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setRightDrawerOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div class={styles.content}>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
          >
            add category
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
          >
            add site
          </Button>

          <ImportButton />

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
          >
            export
          </Button>

          <TextField
            label="Text preview height (in rows)"
            type="number"
            fullWidth
          />

          <TextField
            label="Consecutive failures before disabling a site"
            type="number"
            fullWidth
          />

          <Button variant="text" onClick={() => setOpenLogoutModal(true)}>Logout</Button>
        </div>
      </div>
    </>
  );
}

export default RightDrawer
