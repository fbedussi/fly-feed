import './global.css'

import { Component, createEffect } from 'solid-js'

import { initAuth } from './backend/init'
import HomePage from './pages/HomePage'
import LoadingPage from './pages/LoadingPage'
import LoginPage from './pages/LoginPage'
import { setUser, user } from './state'

const red = "red";

const App: Component = () => {

  createEffect(() => {
    initAuth
      .then((auth) => {
        if (auth.currentUser) {
          const user = {
            id: auth.currentUser.uid,
            username: auth.currentUser.providerData[0].uid,
          }
          setUser(user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
  })

  return <>
    {user()
      ? <HomePage />
      : user() === undefined
        ? <LoadingPage />
        : <LoginPage />
    }
  </>
};

export default App;

