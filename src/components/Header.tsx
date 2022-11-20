import { Component } from 'solid-js'

import {
  leftDrawerOpen, rightDrawerOpen, setLeftDrawerOpen,
  setRightDrawerOpen
} from '../state'
import {
  AccountCircleIcon, AppBar, IconButton,
  MenuIcon, Toolbar
} from '../styleguide'
import styles from './Header.module.css'
import { Logo } from './logo'

const Header = () => {
  return (
    <AppBar position="static" color="transparent" >
      <Toolbar sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
      }}>
        <IconButton
          size="large"
          edge="start"
          color="primary"
          aria-label="menu"
          sx={{ mr: 2 }}
          class={styles.menuButton}
          onClick={() => setLeftDrawerOpen(!leftDrawerOpen())}
        >
          <MenuIcon />
        </IconButton>
        <Logo />
        <IconButton
          size="large"
          edge="start"
          color="primary"
          aria-label="menu"
          sx={{ mr: 2 }}
          class={styles.updateButton}
          onClick={() => setRightDrawerOpen(!rightDrawerOpen())}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
