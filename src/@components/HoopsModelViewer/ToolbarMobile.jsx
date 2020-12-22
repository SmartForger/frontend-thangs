import React from 'react'
import ColorPicker from './ColorPicker'
import ExplodeDropdown from './ExplodeDropdown'
import OrientationDropdown from './OrientationDropdown'
import PartExplorerDropdown from './PartExplorerDropdown'
import { DrawModeActionMenu, Spacer } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as CameraIcon } from '@svg/icon-camera.svg'

const useStyles = createUseStyles(theme => {
  return {
    Toolbar: {
      margin: '0 auto 2rem',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    Toolbar_Group: {
      display: 'flex',
      alignItems: 'center',
      margin: '0',
      padding: 0,
      flexWrap: 'wrap',
      flexDirection: 'column',
      backgroundColor: theme.colors.white[400],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: '.75rem',
      boxShadow: '0 1rem 2rem 0 rgba(0,0,0,.1)',
      flexGrow: 1,
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

const Toolbar = ({
  color,
  className,
  isAssembly = true,
  isMultipart = true,
  magnitude,
  mode,
  model,
  orientation,
  handleColorChange,
  handleDrawChange,
  handleSliderChange,
  handleSnapshot,
  handleViewChange,
  showPartSelector,
  selectedFilename,
  setViewerModel,
}) => {
  const c = useStyles({ isAssembly, isMultipart })
  return (
    <>
      <div className={classnames(c.Toolbar, className)}>
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <DrawModeActionMenu selectedValue={mode} onChange={handleDrawChange} />
          <Spacer size={'1rem'} />
        </div>
        <Spacer size={'.75rem'} />
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <ColorPicker color={color} onChange={handleColorChange} />
          <Spacer size={'1rem'} />
        </div>
        <Spacer size={'.75rem'} />
        {isAssembly && (
          <>
            <div className={c.Toolbar_Group}>
              <Spacer size={'1rem'} />
              <ExplodeDropdown
                selectedValue={magnitude}
                handleChange={handleSliderChange}
              />
              <Spacer size={'1rem'} />
            </div>
            <Spacer size={'.75rem'} />
          </>
        )}
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <CameraIcon onClick={handleSnapshot} />
          <Spacer size={'1rem'} />
        </div>
        <Spacer size={'.75rem'} />
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <OrientationDropdown
            selectedValue={orientation}
            handleChange={handleViewChange}
          />
          <Spacer size={'1rem'} />
        </div>
      </div>
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
    </>
  )
}

export default Toolbar
