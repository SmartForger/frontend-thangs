import React, { useCallback, useState } from 'react'
import ToolbarDesktop from './ToolbarDesktop'
import ToolbarMobile from './ToolbarMobile'
import { createUseStyles, useTheme } from '@physna/voxel-ui/@style'

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
  setSelectedModel = noop,
  selectedModel = {},
  highlightedModel = {},
}) => {
  const isMultipart = !model.isAssembly && model.parts && model.parts.length > 1
  const isAssembly =
    (selectedModel &&
      selectedModel.parts &&
      selectedModel.parts.length &&
      !isMultipart) ||
    (selectedModel && selectedModel.parentId !== undefined)
  const c = useStyles({ isMultipart, isAssembly })
  //These keep track the UI toolbar state
  const [mode, setMode] = useState(null)
  const [orientation, setOrientation] = useState('TopLeftFront')
  const [color, setColor] = useState('#999')
  const [magnitude, setMagnitude] = useState(0)
  const isMobile = !useTheme().breakpoints.md_viewer

  //These control the HOOPS viewer
  const {
    resetImage,
    changeColor,
    changeDrawMode,
    changeExplosionMagnitude,
    changeViewOrientation,
    getViewerSnapshot,
    highlightPart,
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

  const handlePartHover = useCallback(
    node => {
      highlightPart(node.originalPartName)
    },
    [highlightPart]
  )

  const handleLeavePartList = useCallback(() => {
    highlightPart(null)
  }, [highlightPart])

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
    onHoverPart: handlePartHover,
    onLeaveList: handleLeavePartList,
    partList,
    setSelectedModel,
    selectedModel,
    highlightedModel: highlightedModel || {},
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
