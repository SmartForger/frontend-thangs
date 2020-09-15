import React, { useCallback } from 'react'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as ColorIcon1 } from '@svg/icon-color-1.svg'
import { ReactComponent as ColorIcon2 } from '@svg/icon-color-2.svg'
import { ReactComponent as ShadedIcon } from '@svg/icon-shaded.svg'
import { ReactComponent as CompositeIcon } from '@svg/icon-composite.svg'
import { ReactComponent as WireframeIcon } from '@svg/icon-wireframe.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    HowTo: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: '1rem',
    },
    HowTo_Container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    HowTo_IconContainer: {
      display: 'flex',

      '& svg + svg': {
        marginLeft: '1.5rem',
      },
    },
    HowTo_IconSpacing: {
      marginLeft: '3rem',
    },
    HowTo_ExitIcon: {
      position: 'absolute',
      right: '2rem',
      top: '2rem',
      cursor: 'pointer',

      '& svg': {
        fill: theme.variables.colors.BLACK_5,
        stroke: theme.variables.colors.BLACK_5,
      },
    },
    HowTo_Text: {
      maxWidth: '29.5rem',
      color: theme.variables.colors.viewerText,
      marginBottom: '4.5rem',
    },
    HowTo_Title: {
      ...theme.text.howToTitle,
      marginBottom: '1.5rem',
    },
  }
})

const Text = ({ className }) => {
  return (
    <div className={className}>
      Model can be viewed as Wireframe, Shaded or Composite and changed via the icons in
      the viewer. Wireframe color and shading color can be changed using the paint icons
      in the viewer. Model can be zoomed in and out and rotated 360 degrees.
    </div>
  )
}

const Title = ({ className }) => {
  return <h4 className={className}>How to Use:</h4>
}

const Icons = () => {
  const c = useStyles()
  return (
    <div className={c.HowTo_IconContainer}>
      <div>
        <ShadedIcon />
        <WireframeIcon />
        <CompositeIcon />
      </div>

      <div className={c.HowTo_IconSpacing}>
        <ColorIcon1 />
        <ColorIcon2 />
      </div>
    </div>
  )
}

const HowTo = ({ setSeenHowTo }) => {
  const c = useStyles()
  const handleClick = useCallback(() => setSeenHowTo(true), [setSeenHowTo])
  return (
    <div className={c.HowTo} onClick={handleClick}>
      <div className={c.HowTo_ExitIcon}>
        <ExitIcon />
      </div>
      <div className={c.HowTo_Container}>
        <Title className={c.HowTo_Title} />
        <Text className={c.HowTo_Text} />
        <Icons />
      </div>
    </div>
  )
}

export default HowTo
