import { Component, createEffect, onMount } from 'solid-js'

import Header from '../components/Header'
import LeftDrawer from '../components/LeftDrawer'
import RightDrawer from '../components/RightDrawer'
import UpdateButton from '../components/UpdateButton'
import Main from '../components/Main'
import { setArticles, setSubscriptions } from '../state'
import openDb from '../cache'
import { useGetSubscriptions, useSetSubscriptions } from '../primitives/db'

const HomePage: Component = () => {
  onMount(async () => {
    openDb().then((db: any) => db.readCache().then((cachedDataParsed: any) => {
      if (cachedDataParsed) {
        setArticles(cachedDataParsed.articles)
      }
    }))

    const [data] = useGetSubscriptions()
    createEffect(() => {
      const subscriptions = data()
      if (subscriptions) {
        setSubscriptions(subscriptions)
      }
    })
  });

  useSetSubscriptions()

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
