import { Accessor, Component } from 'solid-js'

import { logoutBe } from '../backend/login'
import { setUser } from '../state'
import {
  Button, Modal, Paper,
  Typography
} from '../styleguide'
import styles from './LogoutModal.module.css'

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

type Props = {
  open: Accessor<boolean>
  handleClose: () => void
}

const LogoutModal: Component<Props> = (props) => {
  return (
    <Modal
      open={props.open()}
      onClose={props.handleClose}
    >
      <Paper sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 'min(400px, 90%)',
        p: 4,
      }}>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to logout?
        </Typography>
        <div class={styles.buttons}>
          <Button onClick={() => {
            logout().then(() => props.handleClose())
          }}>
            Yes
          </Button>

          <Button variant="contained" onClick={props.handleClose}>Cancel</Button>
        </div>
      </Paper>
    </Modal>
  )
}

export default LogoutModal
