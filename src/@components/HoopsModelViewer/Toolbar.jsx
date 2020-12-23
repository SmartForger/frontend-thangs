import React, { useCallback, useState } from 'react'
import ToolbarDesktop from './ToolbarDesktop'
import ToolbarMobile from './ToolbarMobile'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    Toolbar__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'block',
      },
    },
    Toolbar__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none !important',
      },
    },
  }
})

const noop = () => null

const Toolbar = ({ hoops, model = {}, setViewerModel = noop, selectedFilename }) => {
  const isMultipart = !model.isAssembly && model.parts.length > 1
  const isAssembly = model.isAssembly
  const c = useStyles({ isMultipart, isAssembly })
  //These keep track the UI toolbar state
  const [mode, setMode] = useState(null)
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
    getViewerSnapshot(model.name)
  }, [getViewerSnapshot, model.name])

  const showPartSelector = isMultipart || isAssembly

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
    setViewerModel,
    selectedFilename,
    showPartSelector,
    model,
  }

  return (
    <>
      <ToolbarDesktop className={c.Toolbar__desktop} {...toolbarProps} />
      <ToolbarMobile className={c.Toolbar__mobile} {...toolbarProps} />
    </>
  )
}

export default Toolbar
