import { Component, ParentComponent } from 'solid-js'
import styles from './Collapse.module.css'

type Props = {
  in: boolean
}

const Collapse: ParentComponent<Props> = (props) => {
  return (
    <div class={props.in ? styles.collapseOpen : styles.collapseClosed}>
      {props.children}
    </div>
  )
}

export default Collapse
