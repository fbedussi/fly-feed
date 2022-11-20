import { Component } from 'solid-js'

import Header from '../components/Header'
import LeftDrawer from '../components/LeftDrawer'
import RightDrawer from '../components/RightDrawer'
import UpdateButton from '../components/UpdateButton'
import Main from '../Main'

const HomePage: Component = () => {
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
