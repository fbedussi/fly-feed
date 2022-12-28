import { Component } from 'solid-js'

import { IconButton as MuiIconButton } from '@suid/material'
import { IconButtonProps } from '@suid/material/IconButton'

const IconButton: Component<IconButtonProps> = (props) => {
  return <MuiIconButton {...props} />
}

export default IconButton
