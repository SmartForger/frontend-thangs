import React, { useCallback, useState, useMemo } from 'react'
import { ToolbarDesktop, ToolbarMobile } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as WireModeSelected } from '@svg/view-mode-wire-selected.svg'
import { ReactComponent as ShadedModeSelected } from '@svg/view-mode-shaded-selected.svg'
import { ReactComponent as XRayModeSelected } from '@svg/view-mode-xray-selected.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Toolbar__desktop: {
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    Toolbar__mobile: {
      display: 'flex',

      [md]: {
        display: 'none !important',
      },
    },
  }
})

const Toolbar = ({ hoops, modelName, isMultipart, isAssembly }) => {
  const c = useStyles({ isMultipart, isAssembly })

  //These keep track the UI toolbar state
  const [mode, setMode] = useState('shaded')
  const [orientation, setOrientation] = useState('Front')
  const [color, setColor] = useState('#999')
  const [magnitude, setMagnitude] = useState(0)

  //These control the HOOPS viewer
  const {
    resetImage,
    changeColor,
    changeDrawMode,
    changeExplosionMagnitude,
    changeViewOrientation,
    getViewerSnapshot,
  } = hoops

  const handleColorChange = useCallback(
    color => {
      changeColor('mesh', color)
      setColor(color)
    },
    [changeColor]
  )

  const handleSliderChange = useCallback(
    (e, value) => {
      changeExplosionMagnitude(value / 10)
      setMagnitude(value)
    },
    [changeExplosionMagnitude]
  )

  const handleDrawChange = useCallback(
    view => {
      changeDrawMode(view)
      setMode(view)
    },
    [changeDrawMode]
  )

  const handleViewChange = useCallback(
    view => {
      changeViewOrientation(view)
      setOrientation(view)
    },
    [changeViewOrientation]
  )

  const handleResetView = useCallback(() => {
    resetImage()
    changeExplosionMagnitude(0)
    setMagnitude(0)
    handleDrawChange('shaded')
    setColor('#999')
  }, [changeExplosionMagnitude, handleDrawChange, resetImage])

  const handleSnapshot = useCallback(() => {
    getViewerSnapshot(modelName)
  }, [getViewerSnapshot, modelName])

  const toolbarProps = {
    color,
    isAssembly,
    isMultipart,
    magnitude,
    mode,
    orientation,
    handleColorChange,
    handleDrawChange,
    handleResetView,
    handleSliderChange,
    handleSnapshot,
    handleViewChange,
  }

  return (
    <>
      <ToolbarDesktop className={c.Toolbar__desktop} {...toolbarProps} />
      <ToolbarMobile className={c.Toolbar__mobile} {...toolbarProps} />
    </>
  )
}

export default Toolbar
