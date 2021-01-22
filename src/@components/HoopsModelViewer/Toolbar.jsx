import React, { useCallback, useState } from 'react'
import ToolbarDesktop from './ToolbarDesktop'
import ToolbarMobile from './ToolbarMobile'
import { createUseStyles } from '@style'
import { useIsMobile } from '@hooks'

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

const Toolbar = ({
  hoops,
  model = {},
  partList = [],
  partTreeData = [],
  setSelectedModel = noop,
  selectedModel = {},
}) => {
  const isMultipart = !model.isAssembly && model.parts && model.parts.length > 1
  const isAssembly =
    (selectedModel.parts && selectedModel.parts.length && !isMultipart) ||
    selectedModel.parentId !== undefined
  const c = useStyles({ isMultipart, isAssembly })
  //These keep track the UI toolbar state
  const [mode, setMode] = useState(null)
  const [orientation, setOrientation] = useState('TopLeftFront')
  const [color, setColor] = useState('#999')
  const [magnitude, setMagnitude] = useState(0)
  const isMobile = useIsMobile()

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
    value => {
      changeExplosionMagnitude(value / 20)
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

  const showPartSelector = isMultipart || model.isAssembly

  const toolbarProps = {
    color,
    isAssembly,
    isMultipart,
    magnitude,
    mode,
    orientation,
    onColorChange: handleColorChange,
    onDrawChange: handleDrawChange,
    onResetView: handleResetView,
    onSliderChange: handleSliderChange,
    onSnapshot: handleSnapshot,
    onViewChange: handleViewChange,
    partList,
    partTreeData,
    setSelectedModel,
    selectedModel,
    showPartSelector,
    model,
  }

  return isMobile ? (
    <ToolbarMobile className={c.Toolbar__mobile} {...toolbarProps} />
  ) : (
    <ToolbarDesktop className={c.Toolbar__desktop} {...toolbarProps} />
  )
}

export default Toolbar
