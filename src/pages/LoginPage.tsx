import { Component } from 'solid-js'

import { loginBe } from '../backend/login'
import { Logo } from '../components/Logo'
import { setUser } from '../state'
import { Button, TextField } from '../styleguide'
import styles from './LoginPage.module.css'

const login =
  ({ email, password }: { email: string; password: string }) =>
    loginBe({ email, password })
      .then(user => {
        if (user) {
          setUser(user)
        }
      })
      .catch(error => {
        // notificationsActions.addNotification({
        //   type: 'error',
        //   messageLabelKey: error.message,
        //   id: error.message,
        // }),
        alert(error.message)
      })

const LoginPage: Component = () => {
  return (
    <div class={styles.loginPage}>
      <form class={styles.loginForm}
        onSubmit={e => {
          e.preventDefault()
          const inputs = [].filter.call(e.currentTarget, (e: HTMLElement) => e.tagName.toLowerCase() === 'input') as HTMLInputElement[]
          login({ email: inputs[0]?.value, password: inputs[1]?.value })
        }}>
        <Logo />
        <TextField label="username" />
        <TextField label="password" type="password" />
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginPage
