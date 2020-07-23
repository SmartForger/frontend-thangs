import React from 'react'
import rightStripes from '@images/Thangs_Stripes_Right.png'
import lefttStripes from '@images/Thangs_Stripes_Left.png'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    BackgroundImage: {
      width: '100vw',
      position: 'absolute',
      display: 'flex',
      justifyContent: 'space-between',
      background: theme.colors.backgroundColor,
      zIndex: -2,
      height: '100%',
      overflow: 'hidden',
    },
    BackgroundImage_Child: {
      margin: '0 3vh',
    },
  }
})

const BackgroundImage = () => {
  const c = useStyles()
  return (
    <div className={c.BackgroundImage}>
      <div className={c.BackgroundImage_child} src={lefttStripes} />
      <div className={c.BackgroundImage_child} src={rightStripes} />
    </div>
  )
}

export { BackgroundImage }
