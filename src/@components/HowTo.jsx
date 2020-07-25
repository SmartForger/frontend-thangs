import React from 'react'
import { Button } from '@components/Button'
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
      ...theme.mixins.text.howToTitle,
      marginBottom: '1.5rem',
    },
  }
})

function Text() {
  return (
    <div>
      Model can be viewed as Wireframe, Shaded or Composite and changed via the icons in
      the viewer. Wireframe color and shading color can be changed using the paint icons
      in the viewer. Model can be zoomed in and out and rotated 360 degrees.
    </div>
  )
}

function Title() {
  return <h4>How to Use:</h4>
}

function Icons() {
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

export function HowTo({ setSeenHowTo }) {
  const c = useStyles()
  const handleClick = () => setSeenHowTo(true)
  return (
    <div className={c.HowTo} onClick={handleClick}>
      <Button text>
        <div className={c.HowTo_ExitIcon}>
          <ExitIcon />
        </div>
      </Button>
      <div className={c.HowTo_Container}>
        <Title className={c.HowTo_Title} />
        <Text className={c.HowTo_Text} />
        <Icons />
      </div>
    </div>
  )
}
