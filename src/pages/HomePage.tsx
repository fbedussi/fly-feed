import {Component, onMount} from 'solid-js'

import Header from '../components/Header'
import LeftDrawer from '../components/LeftDrawer'
import RightDrawer from '../components/RightDrawer'
import UpdateButton from '../components/UpdateButton'
import Main from '../components/Main'
import {setArticles} from '../state'
import openDb from '../cache'
import EditSiteDrawer from '../components/EditSiteDrawer'
import EditCategoryDrawer from '../components/EditCategoryDrawer'

import styles from "./HomePage.module.css";

const HomePage: Component = () => {
  onMount(async () => {
    openDb().then((db: any) => db.readCache().then((cachedDataParsed: any) => {
      if (cachedDataParsed) {
        setArticles(cachedDataParsed.articles)
      }
    }))
  });

  return (
    <>
      <EditSiteDrawer/>
      <EditCategoryDrawer/>

      <Header/>
      <div class={styles.menuAndMain}>
        <LeftDrawer/>

        <Main/>
      </div>

      <RightDrawer/>

      <UpdateButton/>
    </>
  )
}

export default HomePage
