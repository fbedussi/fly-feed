import { Component } from 'solid-js'

import Header from '../components/Header'
import LeftDrawer from '../components/LeftDrawer'
import RightDrawer from '../components/RightDrawer'
import UpdateButton from '../components/UpdateButton'
import Main from '../components/Main'
import EditSiteDrawer from '../components/EditSiteDrawer'
import EditCategoryDrawer from '../components/EditCategoryDrawer'

import styles from './HomePage.module.css'

const HomePage: Component = () => {
  return (
    <>
      <EditSiteDrawer />
      <EditCategoryDrawer />

      <Header />
      <div class={styles.menuAndMain}>
        <LeftDrawer />

        <Main />
      </div>

      <RightDrawer />

      <UpdateButton />
    </>
  )
}

export default HomePage
