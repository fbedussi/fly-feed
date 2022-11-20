import { Component } from 'solid-js'

import { loginBe } from '../backend/login'
import { Logo } from '../components/logo'
import { setUser } from '../state'
import { Button, CircularProgress, TextField } from '../styleguide'
import styles from './LoadingPage.module.css'

const LoadinPage: Component = () => {
  return (
    <div class={styles.loadingPage}>
      <CircularProgress />
    </div>
  )
}

export default LoadinPage
