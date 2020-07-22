import React from 'react'
import { AnchorButton } from '@components/AnchorButton'
import { ColorPicker } from '@components/ColorPicker'
import { TextButton } from '@components/Button'

import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as EdgesColor } from '@svg/view-color-edges.svg'
import { ReactComponent as ShadeColor } from '@svg/view-color-shade.svg'
import { viewerToolbarText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Toolbar: {
      position: 'relative',
      backgroundColor: theme.colors.WHITE_1,
      boxShadow: 'none',
      borderTop: `1px solid ${theme.colors.GREY_1}`,
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
    },
    Toolbar_ToolGroup: {
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      padding: 0,

      '& > button + button': {
        marginLeft: '.75rem',
      },
    },
    Toolbar_ToolGroupTitle: {
      ...viewerToolbarText,
      display: 'none',
      textTransform: 'uppercase',
      margin: 0,
      padding: 0,

      [md]: {
        display: 'block',
      },
    },
    Toolbar_IconButton: {
      height: '2.25rem',
      [md]: {
        marginLeft: '1rem',
      },
    },
    Toolbar_MobileAnchorButton: {
      [md]: {
        display: 'none',
      },
    },
    Toolbar_DesktopAnchorButton: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
  }
})

export function Toolbar({
  onResetView,
  onDrawModeChange,
  onColorChange,
  meshColor,
  wireColor,
}) {
  const c = useStyles()
  const makeDrawModeHandler = modeName => () => {
    onDrawModeChange(modeName)
  }

  const makeColorHandler = modeName => color => {
    onColorChange(modeName, color)
  }

  return (
    <div className={c.Toolbar}>
      <div className={c.Toolbar_ToolGroup}>
        <div className={c.Toolbar_ToolGroupTitle}>Model View</div>
        <TextButton
          className={c.Toolbar_IconButton}
          onClick={makeDrawModeHandler('shaded')}
        >
          <ShadedMode />
        </TextButton>
        <TextButton
          className={c.Toolbar_IconButton}
          onClick={makeDrawModeHandler('wire')}
        >
          <WireMode />
        </TextButton>
        <TextButton
          className={c.Toolbar_IconButton}
          onClick={makeDrawModeHandler('xray')}
        >
          <XRayMode />
        </TextButton>
      </div>
      <div className={c.Toolbar_ToolGroup}>
        <div className={c.Toolbar_ToolGroupTitle}>Change Color</div>
        <TextButton className={c.Toolbar_IconButton}>
          <ColorPicker color={wireColor} onChange={makeColorHandler('wire')}>
            <EdgesColor />
          </ColorPicker>
        </TextButton>
        <TextButton className={c.Toolbar_IconButton}>
          <ColorPicker color={meshColor} onChange={makeColorHandler('mesh')}>
            <ShadeColor />
          </ColorPicker>
        </TextButton>
      </div>
      <AnchorButton className={c.Toolbar_MobileAnchorButton} onClick={onResetView}>
        Reset
      </AnchorButton>
      <AnchorButton className={c.Toolbar_DesktopAnchorButton} onClick={onResetView}>
        Reset Image
      </AnchorButton>
    </div>
  )
}
