import { Component, onMount } from 'solid-js'

import Header from '../components/Header'
import LeftDrawer from '../components/LeftDrawer'
import RightDrawer from '../components/RightDrawer'
import UpdateButton from '../components/UpdateButton'
import Main from '../components/Main'
import { setArticles } from '../state'
import { FetchOk } from '../model/index'

const HomePage: Component = () => {
  onMount(async () => {
    const cachedData = sessionStorage.getItem('fly-feed-updates')
    const cachedDataParsed = !!cachedData && (JSON.parse(cachedData) as { updatedAt: string, articles: FetchOk[] })
    const cachedUpdatedAt = !!cachedDataParsed && new Date(cachedDataParsed.updatedAt)
    const tenMinutes = 1000 * 60 * 10
    if (cachedUpdatedAt && cachedUpdatedAt.getTime() - Date.now() < tenMinutes) {
      setArticles(cachedDataParsed.articles)
    }
  });

  return (
    <>
      <LeftDrawer />

      <RightDrawer />

      <Header />

      <Main />

      <UpdateButton />
    </>
  )
}

export default HomePage
