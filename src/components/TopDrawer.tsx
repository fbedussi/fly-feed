import {ParentComponent} from 'solid-js'

import styles from './topDrawer.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

const TopDrawer: ParentComponent<Props> = (props) => {
  return (
    <>
      <div class={[styles.overlay, props.open ? styles.isOpen : ''].join(' ')}
           onClick={() => props.onClose()}
      />
      <div class={[styles.topDrawer, props.open ? styles.isOpen : ''].join(' ')}>

        <div class={styles.topDrawerInner}>
          {props.children}
        </div>
      </div>
    </>
  );
}

export default TopDrawer
