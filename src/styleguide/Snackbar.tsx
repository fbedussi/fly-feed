import { children, createEffect, JSXElement, ParentComponent } from 'solid-js'

import styles from './Snackbar.module.css'
import IconButton from './IconButton';
import { CloseIcon } from '.';

const Snackbar: ParentComponent<{
  open: boolean
  autoHideDuration?: number
  onClose: () => void
  message?: string
  action?: JSXElement
}> = (props) => {
  createEffect(() => {
    if (props.open) {
      const timeout = props.autoHideDuration || 10000

      setTimeout(() => {
        props.onClose()
      }, timeout)
    }
  })

  return (
    <div classList={{
      [styles.snackbar]: true,
      [styles.open]: props.open,
    }}>
      {props.message || children(() => props.children)}
      {props.action}
      <IconButton size="small" onClick={() => props.onClose()}><CloseIcon /></IconButton>
    </div>
  )
}

export default Snackbar
