import React, { useCallback } from 'react'
import { AnchorButton, Pill, ColorPicker } from '@components'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as EdgesColor } from '@svg/view-color-edges.svg'
import { ReactComponent as ShadeColor } from '@svg/view-color-shade.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Toolbar: {
      position: ({ minimizeTools }) => (minimizeTools ? 'absolute' : 'relative'),
      bottom: 0,
      right: 0,
      backgroundColor: ({ minimizeTools }) =>
        minimizeTools ? 'transparent' : theme.colors.white[400],
      boxShadow: 'none',
      borderTop: ({ minimizeTools }) =>
        minimizeTools ? 'none' : `1px solid ${theme.colors.purple[200]}`,
      padding: ({ minimizeTools }) => (minimizeTools ? '3.375rem 0' : '1.5rem'),
      display: 'flex',
      justifyContent: ({ minimizeTools }) =>
        minimizeTools ? 'flex-end' : 'space-between',
      width: ({ minimizeTools }) => (minimizeTools ? '100%' : 'auto'),
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
      ...theme.text.viewerToolbarText,
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
      outline: 'none',
      [md]: {
        display: 'none',
      },
    },
    Toolbar_DesktopAnchorButton: {
      outline: 'none',
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
    Toolbar_ResetPill: {
      cursor: 'pointer',
      margin: '0 auto !important',
    },
  }
})

const Toolbar = ({
  onResetView,
  onDrawModeChange,
  onColorChange,
  meshColor,
  wireColor,
  minimizeTools = false,
}) => {
  const c = useStyles({ minimizeTools })
  const makeDrawModeHandler = useCallback(
    modeName => () => {
      onDrawModeChange(modeName)
    },
    [onDrawModeChange]
  )

  const makeColorHandler = useCallback(
    modeName => color => {
      onColorChange(modeName, color)
    },
    [onColorChange]
  )

  const handleResetView = useCallback(() => {
    onResetView()
  }, [onResetView])

  return (
    <div className={c.Toolbar}>
      {!minimizeTools ? (
        <>
          <div className={c.Toolbar_ToolGroup}>
            <div className={c.Toolbar_ToolGroupTitle}>Model View</div>
            <div className={c.Toolbar_IconButton} onClick={makeDrawModeHandler('shaded')}>
              <ShadedMode />
            </div>
            <div className={c.Toolbar_IconButton} onClick={makeDrawModeHandler('wire')}>
              <WireMode />
            </div>
            <div className={c.Toolbar_IconButton} onClick={makeDrawModeHandler('xray')}>
              <XRayMode />
            </div>
          </div>
          <div className={c.Toolbar_ToolGroup}>
            <div className={c.Toolbar_ToolGroupTitle}>Change Color</div>
            <div className={c.Toolbar_IconButton}>
              <ColorPicker color={wireColor} onChange={makeColorHandler('wire')}>
                <EdgesColor />
              </ColorPicker>
            </div>
            <div className={c.Toolbar_IconButton}>
              <ColorPicker color={meshColor} onChange={makeColorHandler('mesh')}>
                <ShadeColor />
              </ColorPicker>
            </div>
          </div>
          <AnchorButton
            className={c.Toolbar_MobileAnchorButton}
            onClick={handleResetView}
          >
            Reset
          </AnchorButton>
          <AnchorButton
            className={c.Toolbar_DesktopAnchorButton}
            onClick={handleResetView}
          >
            Reset Image
          </AnchorButton>
        </>
      ) : (
        <Pill className={c.Toolbar_ResetPill} onClick={handleResetView}>
          Reset Position
        </Pill>
      )}
    </div>
  )
}

export default Toolbar
