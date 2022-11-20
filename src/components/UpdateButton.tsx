import { Component } from 'solid-js'

import { AutorenewIcon, Fab } from '../styleguide'

const UpdateButton: Component = () => {
  return (
    <Fab color="primary" sx={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
    }}>
      <AutorenewIcon />
    </Fab>
  )
}

export default UpdateButton
