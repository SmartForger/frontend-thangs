import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { SigninFacebookButton, SigninGoogleButton } from '@overlays/Signin'

export default {
  title: 'Molecules/ButtonsSSO',
}

const useStyles = createUseStyles(_theme => {
  return {
    Container: {
      '& > *': {
        margin: '3rem',
      },
    },
  }
})

export const ButtonsSSOTest = () => {
  const c = useStyles({})

  return (
    <div className={c.Container}>
      <SigninFacebookButton />
      <SigninGoogleButton />
    </div>
  )
}
