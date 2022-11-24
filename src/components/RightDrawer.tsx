import {
  Component,
  createSignal
} from 'solid-js'

import { logoutBe } from '../backend/login'
import {
  rightDrawerOpen,
  setRightDrawerOpen, setUser
} from '../state'
import {
  Button, CloseIcon,
  Drawer, FileDownloadIcon,
  IconButton,
  TextField,
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
    <Drawer open={rightDrawerOpen()} anchor="right" onClose={() => setRightDrawerOpen(false)}>
      <LogoutModal open={openLogoutModal} handleClose={() => setOpenLogoutModal(false)} />

      <div class={styles.rightDrawerInner}>
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
    </Drawer>
  );
}

export default RightDrawer
