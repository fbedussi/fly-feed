import { IconButton as MuiIconButton } from '@suid/material'
import { IconButtonProps } from '@suid/material/IconButton'
import { Component } from 'solid-js'

const IconButton: Component<IconButtonProps> = (props) => {
  return <MuiIconButton sx={{ color: 'currentColor' }} {...props} />
}

export default IconButton
