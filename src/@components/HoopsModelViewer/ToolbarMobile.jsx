import React from 'react'
import {
  DrawModeActionMenu,
  ColorPickerActionMenu,
  ExplodeActionMenu,
  OrientationActionMenu,
  PartExplorerActionMenu,
  Spacer,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as CameraIcon } from '@svg/icon-camera.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    Toolbar: {
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
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
      maxWidth: 100,
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
    Toolbar_Snapshot: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    Toolbar_PartExplorerWrapper: {
      position: 'relative',
      maxWidth: ({ isAssembly }) => (isAssembly ? '35rem' : '27.5rem'),
      marginBottom: '3rem',

      [md_viewer]: {
        maxWidth: '100%',
      },
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
  onColorChange,
  onDrawChange,
  onSliderChange,
  onSnapshot,
  onViewChange,
  partList,
  showPartSelector,
  selectedModel,
  setSelectedModel,
}) => {
  const c = useStyles({ isAssembly, isMultipart })
  return (
    <>
      <div className={classnames(c.Toolbar, className)}>
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <DrawModeActionMenu selectedValue={mode} onChange={onDrawChange} />
          <Spacer size={'1rem'} />
        </div>
        <Spacer size={'.75rem'} />
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <ColorPickerActionMenu selectedValue={color} onChange={onColorChange} />
          <Spacer size={'1rem'} />
        </div>
        <Spacer size={'.75rem'} />
        {isAssembly && (
          <>
            <div className={c.Toolbar_Group}>
              <Spacer size={'1rem'} />
              <ExplodeActionMenu selectedValue={magnitude} onChange={onSliderChange} />
              <Spacer size={'1rem'} />
            </div>
            <Spacer size={'.75rem'} />
          </>
        )}
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <div className={c.Toolbar_Snapshot}>
            <CameraIcon onClick={onSnapshot} />
          </div>
          <Spacer size={'1rem'} />
        </div>
        <Spacer size={'.75rem'} />
        <div className={c.Toolbar_Group}>
          <Spacer size={'1rem'} />
          <OrientationActionMenu selectedValue={orientation} onChange={onViewChange} />
          <Spacer size={'1rem'} />
        </div>
      </div>
      {showPartSelector && (
        <>
          <Spacer size={'1rem'} />
          <div className={classnames(c.Toolbar, className)}>
            <div className={classnames(c.Toolbar_Group, c.Toolbar_PartExplorerWrapper)}>
              <PartExplorerActionMenu
                selectedValue={selectedModel}
                partList={partList}
                onChange={setSelectedModel}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Toolbar
