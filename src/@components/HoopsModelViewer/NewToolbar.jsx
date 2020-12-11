import React, { useCallback, useEffect, useState, useMemo } from 'react'
import classnames from 'classnames'
import { Pill, ColorPicker, Spacer, MetadataSecondary, Slider } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ResetIcon } from '@svg/icon-reset.svg'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { OrientationDropdownMenu, OrientationDropdown } from './OrientationDropdown'
import { ModelSearchDropdownMenu, ModelSearchDropdown } from './ModelSearchDropdown'

const useStyles = createUseStyles(_theme => {
  return {
    Toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '3rem 2rem',
      flexWrap: 'wrap',
      backgroundColor: '#F7F7FB',
      borderBottomLeftRadius: '1rem',
      borderBottomRightRadius: '1rem',
    },
    Toolbar_Group: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 auto',
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
        fill: '#000',
      },
    },
  }
})

const NewToolbar = ({ hoops, minimizeTools }) => {
  const c = useStyles()
  const [mode, setMode] = useState('shaded')
  const [orientation, setOrientation] = useState('Front')
  const [color, setColor] = useState('#999')
  const {
    resetImage,
    changeColor,
    changeDrawMode,
    changeExplosionMagnitude,
    changeViewOrientation,
    getViewerSnapshot,
  } = hoops

  const handleShadedMode = useCallback(() => {
    changeDrawMode('shaded')
    setMode('shaded')
  }, [changeDrawMode])

  const handleWireMode = useCallback(() => {
    changeDrawMode('wire')
    setMode('wire')
  }, [changeDrawMode])

  const handleXRayMode = useCallback(() => {
    changeDrawMode('xray')
    setMode('xray')
  }, [changeDrawMode])

  const handleColorChange = useCallback(
    color => {
      debugger
      changeColor('mesh', color)
      setColor(color)
    },
    [changeColor]
  )

  const handleSliderChange = useCallback(
    (e, value) => {
      changeExplosionMagnitude(value / 10)
    },
    [changeExplosionMagnitude]
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
    handleShadedMode()
  }, [changeExplosionMagnitude, handleShadedMode, resetImage])

  const orientationOptions = useMemo(
    () => [
      {
        label: 'Top',
        value: 'Top',
        selected: orientation === 'Top',
        onClick: () => handleViewChange('Top'),
      },
      {
        label: 'Front',
        value: 'Front',
        selected: orientation === 'Front',
        onClick: () => handleViewChange('Front'),
      },
      {
        label: 'Back',
        value: 'Back',
        selected: orientation === 'Back',
        onClick: () => handleViewChange('Back'),
      },
      {
        label: 'Right',
        value: 'Right',
        selected: orientation === 'Right',
        onClick: () => handleViewChange('Right'),
      },
      {
        label: 'Left',
        value: 'Left',
        selected: orientation === 'Left',
        onClick: () => handleViewChange('Left'),
      },
    ],
    [handleViewChange, orientation]
  )

  const orientationLabel = useMemo(
    () => orientationOptions.find(opt => opt.value === orientation).label,
    [orientationOptions, orientation]
  )

  return (
    <div className={c.Toolbar}>
      <div className={c.Toolbar_Group}>
        <Pill secondary onClick={handleResetView}>
          <ResetIcon />
          <Spacer width={'0.25rem'} />
          Reset
        </Pill>
        {!minimizeTools && (
          <>
            <Spacer width={'2rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Texture</MetadataSecondary>
              <Spacer width={'1rem'} />
              <ShadedMode
                className={classnames(c.Toolbar_IconButton, {
                  selected: mode === 'shaded',
                })}
                onClick={handleShadedMode}
              />
              <Spacer width={'1rem'} />
              <WireMode
                className={classnames(c.Toolbar_IconButton, {
                  selected: mode === 'wire',
                })}
                onClick={handleWireMode}
              />
              <Spacer width={'1rem'} />
              <XRayMode
                className={classnames(c.Toolbar_IconButton, {
                  selected: mode === 'xray',
                })}
                onClick={handleXRayMode}
              />
            </div>
            <Spacer width={'2rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Orientation</MetadataSecondary>
              <Spacer width={'1rem'} />
              <OrientationDropdownMenu
                options={orientationOptions}
                TargetComponent={OrientationDropdown}
                label={orientationLabel}
              />
            </div>
            <Spacer width={'2rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Color</MetadataSecondary>
              <Spacer width={'1rem'} />
              <ColorPicker color={color} onChange={handleColorChange}>
                <div className={c.Toolbar_Group}>
                  <div
                    className={c.Toolbar_ColorCircle}
                    style={{ backgroundColor: color }}
                  />
                  <Spacer width={'0.5rem'} />
                  <ArrowDown />
                </div>
              </ColorPicker>
            </div>
            <Spacer width={'2rem'} />
            <div className={c.Toolbar_Group}>
              <MetadataSecondary>Explode</MetadataSecondary>
              <Spacer width={'1.5rem'} />
              <Slider onChange={handleSliderChange} marks={true} steps={60} />
            </div>
          </>
        )}
      </div>
      {!minimizeTools && (
        <div className={c.Toolbar_Group}>
          <MetadataSecondary>Explode</MetadataSecondary>
          <Spacer width={'1rem'} />
          <ModelSearchDropdownMenu
            TargetComponent={ModelSearchDropdown}
            label='Starship Enterprise'
            canRemove
            onRemove={() => {
              console.log('remove model')
            }}
          />
        </div>
      )}
    </div>
  )
}

export default NewToolbar
