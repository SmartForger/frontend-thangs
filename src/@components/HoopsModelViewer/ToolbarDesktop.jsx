import React from 'react'
import { DrawModeActionMenu, Pill, Spacer, MetadataSecondary, Slider } from '@components'
import ColorPicker from './ColorPicker'
import ExplodeDropdown from './ExplodeDropdown'
import OrientationDropdown from './OrientationDropdown'
import PartExplorerDropdown from './PartExplorerDropdown'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ResetIcon } from '@svg/icon-reset.svg'
import { ReactComponent as CameraDesktopIcon } from '@svg/icon-camera-desktop.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { lg, xl_viewer },
  } = theme
  return {
    Toolbar: {
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
    Toolbar_WideText: {
      display: 'none',
      alignItems: 'center',

      [xl_viewer]: {
        display: 'flex',
      },
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
    Toolbar__medium: {
      display: 'flex',

      [lg]: {
        display: 'none',
      },
    },
    Toolbar_PartExplorerWrapper: {
      position: 'relative',
    },
  }
})

const Toolbar = ({
  color,
  className,
  isAssembly = true,
  isMultipart = true,
  magnitude,
  mode,
  orientation,
  handleColorChange,
  handleDrawChange,
  handleResetView,
  handleSliderChange,
  handleSnapshot,
  handleViewChange,
  selectedFilename,
  setViewerModel,
  showPartSelector,
  model,
}) => {
  const c = useStyles({ isAssembly, isMultipart })

  return (
    <div className={classnames(c.Toolbar, className)}>
      <Spacer size={'1.5rem'} />
      <div className={c.Toolbar_Group}>
        <Spacer size={'2rem'} />
        <Pill secondary onClick={handleResetView}>
          <ResetIcon />
          <div className={c.Toolbar_WideText}>
            <Spacer size={'0.25rem'} />
            <span>Reset</span>
          </div>
        </Pill>
        <Spacer size={'1rem'} />
        <Pill secondary onClick={handleSnapshot}>
          <CameraDesktopIcon />
          <div className={c.Toolbar_WideText}>
            <Spacer size={'0.25rem'} />
            <span>Snapshot</span>
          </div>
        </Pill>
        <Spacer size={'1.125rem'} />
        <div className={c.Toolbar_VerticalRule}></div>
        <Spacer size={'1.125rem'} />
        <div className={c.Toolbar_Group}>
          <div className={c.Toolbar_WideText}>
            <MetadataSecondary>Render</MetadataSecondary>
            <Spacer size={'1rem'} />
          </div>
          <DrawModeActionMenu selectedValue={mode} onChange={handleDrawChange} />
        </div>
        <Spacer size={'1.125rem'} />
        <div className={c.Toolbar_VerticalRule}></div>
        <Spacer size={'1.125rem'} />
        <div className={c.Toolbar_Group}>
          <div className={c.Toolbar_WideText}>
            <MetadataSecondary>Orientation</MetadataSecondary>
            <Spacer size={'1rem'} />
          </div>
          <OrientationDropdown
            selectedValue={orientation}
            handleChange={handleViewChange}
          />
        </div>
        <Spacer size={'1.125rem'} />
        <div className={c.Toolbar_VerticalRule}></div>
        <Spacer size={'1.125rem'} />
        <div className={c.Toolbar_Group}>
          <div className={c.Toolbar_WideText}>
            <MetadataSecondary>Color</MetadataSecondary>
            <Spacer size={'1rem'} />
          </div>
          <ColorPicker color={color} onChange={handleColorChange} />
        </div>
        {isAssembly && (
          <>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_Group}>
              <ExplodeDropdown
                selectedValue={magnitude}
                handleChange={handleSliderChange}
              />
              <div className={c.Toolbar_WideText}>
                <Spacer size={'1rem'} />
                <Slider onChange={handleSliderChange} steps={30} value={magnitude} />
                <Spacer size={'1.125rem'} />
              </div>
            </div>
          </>
        )}
        {showPartSelector && (
          <>
            <Spacer size={'1.125rem'} />
            <div className={c.Toolbar_VerticalRule}></div>
            <Spacer size={'1.125rem'} />
            <div className={classnames(c.Toolbar_Group, c.Toolbar_PartExplorerWrapper)}>
              <PartExplorerDropdown
                setViewerModel={setViewerModel}
                selectedFilename={selectedFilename}
                model={model}
                handleChange={setViewerModel}
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
