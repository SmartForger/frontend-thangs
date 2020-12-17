import React, { useCallback, useState, useMemo } from 'react'
import { Pill, ColorPicker, Spacer, MetadataSecondary, Slider } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ResetIcon } from '@svg/icon-reset.svg'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as WireModeSelected } from '@svg/view-mode-wire-selected.svg'
import { ReactComponent as ShadedModeSelected } from '@svg/view-mode-shaded-selected.svg'
import { ReactComponent as XRayModeSelected } from '@svg/view-mode-xray-selected.svg'
import { ReactComponent as TopViewIcon } from '@svg/view-top-icon.svg'
import { ReactComponent as FrontViewIcon } from '@svg/view-front-icon.svg'
import { ReactComponent as BackViewIcon } from '@svg/view-back-icon.svg'
import { ReactComponent as RightViewIcon } from '@svg/view-right-icon.svg'
import { ReactComponent as LeftViewIcon } from '@svg/view-left-icon.svg'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUp } from '@svg/icon-arrow-up-sm.svg'
import { ReactComponent as CameraIcon } from '@svg/icon-camera.svg'
import { ModeDropdownMenu, ModeDropdown } from './ModeDropdown'
import { ModelSearchDropdown } from './ModelSearchDropdown'

const useStyles = createUseStyles(theme => {
  return {
    Toolbar: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.colors.white[400],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: '.75rem',
      boxShadow: '0 1rem 2rem 0 rgba(0,0,0,.1)',
      margin: '0 auto 2.625rem',
    },
    Toolbar_Group: {
      display: 'flex',
      alignItems: 'center',
      margin: '0',
      padding: 0,
      flexWrap: 'wrap',
    },
    Toolbar_ResetPill: {
      cursor: 'pointer',
      margin: '0 auto !important',
    },
    Toolbar_IconButton: {
      width: '2rem',
      height: '2rem',
      cursor: 'pointer',
      '&.selected': {
        '& g[opacity]': {
          opacity: 1,
        },
      },
      display: 'none',
    },
    Toolbar_IconButton__selected: {
      display: 'flex',
    },
    Toolbar_ColorCircle: {
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
    },
    Toolbar_RemoveIcon: {
      width: '.75rem',
      height: '.75rem',
      '& path': {
        fill: theme.colors.black[500],
      },
    },
    Toolbar_VerticalRule: {
      borderLeft: `1px solid ${theme.colors.white[900]}`,
      height: '2rem',
    },
  }
})

const Toolbar = ({ hoops, minimizeTools, modelName }) => {
  const c = useStyles()
  const [mode, setMode] = useState('shaded')
  const [orientation, setOrientation] = useState('Front')
  const [color, setColor] = useState('#999')
  const [magnitude, setMagnitude] = useState(0)
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
      setOrientation(view)
      changeViewOrientation(view)
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

  const orientationOptions = useMemo(
    () => [
      {
        label: 'Top',
        Icon: TopViewIcon,
        value: 'Top',
        selected: orientation === 'Top',
        onClick: () => handleViewChange('Top'),
      },
      {
        label: 'Front',
        Icon: FrontViewIcon,
        value: 'Front',
        selected: orientation === 'Front',
        onClick: () => handleViewChange('Front'),
      },
      {
        label: 'Back',
        Icon: BackViewIcon,
        value: 'Back',
        selected: orientation === 'Back',
        onClick: () => handleViewChange('Back'),
      },
      {
        label: 'Right',
        Icon: RightViewIcon,
        value: 'Right',
        selected: orientation === 'Right',
        onClick: () => handleViewChange('Right'),
      },
      {
        label: 'Left',
        Icon: LeftViewIcon,
        value: 'Left',
        selected: orientation === 'Left',
        onClick: () => handleViewChange('Left'),
      },
    ],
    [handleViewChange, orientation]
  )

  const orientationLabel = useMemo(
    () => orientationOptions.find(opt => opt.value === orientation).label,
    [orientation, orientationOptions]
  )

  const drawOptions = useMemo(
    () => [
      {
        label: 'Shaded',
        Icon: ShadedMode,
        value: 'shaded',
        selected: mode === 'shaded',
        selectedIcon: ShadedModeSelected,
        onClick: () => handleDrawChange('shaded'),
      },
      {
        label: 'Wire',
        Icon: WireMode,
        value: 'wire',
        selected: mode === 'wire',
        selectedIcon: WireModeSelected,
        onClick: () => handleDrawChange('wire'),
      },
      {
        label: 'Xray',
        Icon: XRayMode,
        value: 'xray',
        selected: mode === 'xray',
        selectedIcon: XRayModeSelected,
        onClick: () => handleDrawChange('xray'),
      },
    ],
    [handleDrawChange, mode]
  )

  const drawIcon = useMemo(
    () => drawOptions.find(opt => opt.value === mode).selectedIcon,
    [drawOptions, mode]
  )

  return (
    <div className={c.Toolbar}>
      <Spacer size={'1.5rem'} />
      <div className={c.Toolbar_Group}>
        <Spacer size={'2rem'} />
        <Pill secondary onClick={handleResetView}>
          <ResetIcon />
          <Spacer size={'0.25rem'} />
          Reset
        </Pill>
        {!minimizeTools && (
          <>
            <Spacer size={'1rem'} />
            <Pill secondary onClick={handleSnapshot}>
              <CameraIcon />
              <Spacer size={'0.25rem'} />
              Snapshot
            </Pill>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Render</MetadataSecondary>
              <Spacer size={'1rem'} />
              <ModeDropdownMenu
                options={drawOptions}
                TargetComponent={ModeDropdown}
                Icon={drawIcon}
              />
            </div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Orientation</MetadataSecondary>
              <Spacer size={'1rem'} />
              <ModeDropdownMenu
                options={orientationOptions}
                TargetComponent={ModeDropdown}
                label={orientationLabel}
              />
            </div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Color</MetadataSecondary>
              <Spacer size={'1rem'} />
              <ColorPicker color={color} onChange={handleColorChange}>
                <div
                  className={c.Toolbar_ColorCircle}
                  style={{ backgroundColor: color }}
                />
                <Spacer size={'0.5rem'} />
                <ArrowUp />
              </ColorPicker>
            </div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Explode</MetadataSecondary>
              <Spacer size={'1rem'} />
              <Slider onChange={handleSliderChange} steps={30} value={magnitude} />
            </div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>ThNl</MetadataSecondary>
              <Spacer size={'1rem'} />
              <ModelSearchDropdown
                label={'Model Assembly'}
                selectedFile={'selected part'}
                files={[]}
              />
            </div>
          </>
        )}
        <Spacer size={'2rem'} />
      </div>
      <Spacer size={'1.5rem'} />
    </div>
  )
}

export default Toolbar
