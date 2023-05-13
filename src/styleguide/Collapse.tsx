import { ParentComponent } from 'solid-js'
import styles from './Collapse.module.css'

type Props = {
  in: boolean
}

const Collapse: ParentComponent<Props> = (props) => {
  return (
    <div class={styles.collapse} classList={{ [styles.open]: props.in }}>
      {props.children}
    </div>
  )
}

export default Collapse
