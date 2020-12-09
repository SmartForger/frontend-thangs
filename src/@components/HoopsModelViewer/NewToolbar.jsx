import React, { useState, useMemo } from 'react'
import classnames from 'classnames'
import {
  Pill,
  ColorPicker,
  Spacer,
  MetadataSecondary,
  DropdownMenu,
  Slider,
  SingleLineBodyText,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ResetIcon } from '@svg/icon-reset.svg'
import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg'
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg'
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as RemoveIcon } from '@svg/icon-X.svg'
import { OrientationDropdownMenu, OrientationDropdown } from './OrientationDropdown'
import { ModelSearchDropdownMenu, ModelSearchDropdown } from './ModelSearchDropdown'
import { ReactComponent as ShadeColor } from '@svg/view-color-shade.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
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
      margin: 0,
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

const NewToolbar = () => {
  const c = useStyles()
  const [mode, setMode] = useState('shaded')
  const [orientation, setOrientation] = useState('front')
  const [color, setColor] = useState('#999')

  const selectViewMode = mode => {
    setMode(mode)
  }

  const orientationOptions = useMemo(
    () => [
      {
        label: 'Front',
        value: 'front',
        selected: orientation === 'front',
        onClick: () => setOrientation('front'),
      },
      {
        label: 'Front',
        value: 'front',
        selected: orientation === 'front',
        onClick: () => setOrientation('front'),
      },
      {
        label: 'Top',
        value: 'top',
        selected: orientation === 'top',
        onClick: () => setOrientation('top'),
      },
    ],
    []
  )

  const orientationLabel = useMemo(
    () => orientationOptions.find(opt => opt.value === orientation).label,
    [orientationOptions, orientation]
  )

  return (
    <div className={c.Toolbar}>
      <div className={c.Toolbar_Group}>
        <Pill secondary>
          <ResetIcon />
          <Spacer width={'0.25rem'} />
          Reset
        </Pill>
        <Spacer width={'2rem'} />
        <div className={c.Toolbar_Group}>
          <MetadataSecondary>Texture</MetadataSecondary>
          <Spacer width={'1rem'} />
          <ShadedMode
            className={classnames(c.Toolbar_IconButton, { selected: mode === 'shaded' })}
            onClick={() => selectViewMode('shaded')}
          />
          <Spacer width={'1rem'} />
          <WireMode
            className={classnames(c.Toolbar_IconButton, { selected: mode === 'wire' })}
            onClick={() => selectViewMode('wire')}
          />
          <Spacer width={'1rem'} />
          <XRayMode
            className={classnames(c.Toolbar_IconButton, { selected: mode === 'xray' })}
            onClick={() => selectViewMode('xray')}
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
          <ColorPicker color={color} onChange={color => setColor(color)}>
            <div className={c.Toolbar_Group}>
              <div className={c.Toolbar_ColorCircle} style={{ backgroundColor: color }} />
              <Spacer width={'0.5rem'} />
              <ArrowDown />
            </div>
          </ColorPicker>
        </div>
        <Spacer width={'2rem'} />
        <div className={c.Toolbar_Group}>
          <MetadataSecondary>Explode</MetadataSecondary>
          <Spacer width={'1.5rem'} />
          <Slider />
        </div>
      </div>
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
    </div>
  )
}

export default NewToolbar
