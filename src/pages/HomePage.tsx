import { Component, createEffect, onMount } from 'solid-js'

import Header from '../components/Header'
import LeftDrawer from '../components/LeftDrawer'
import RightDrawer from '../components/RightDrawer'
import UpdateButton from '../components/UpdateButton'
import Main from '../components/Main'
import { setArticles } from '../state'
import openDb from '../cache'
import TopDrawer from '../components/TopDrawer'

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
      <TopDrawer />

      <LeftDrawer />

      <RightDrawer />

      <Header />

      <Main />

      <UpdateButton />
    </>
  )
}

export default HomePage
