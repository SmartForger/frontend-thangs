import React from 'react'
import {
  ColorPickerActionMenu,
  DrawModeActionMenu,
  MetadataSecondary,
  OrientationActionMenu,
  PartExplorerActionMenu,
  Pill,
  Slider,
  Spacer,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { ReactComponent as ResetIcon } from '@svg/icon-reset.svg'
import { ReactComponent as CameraDesktopIcon } from '@svg/icon-camera-desktop.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer, lg, lg_viewer, xxl_viewer, xl },
  } = theme
  return {
    Toolbar: {
      backgroundColor: 'rgba(255,255,255,.8)',
      border: `1px solid ${theme.colors.white[900]}`,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 0,
      position: 'absolute',
      bottom: 0,
      width: 'calc(100% - 2rem)',
      padding: '0 1rem',

      '& div': {
        flex: 'none',
      },

      [lg_viewer]: {
        padding: '0 2rem',
        width: 'calc(100% - 4rem)',
      },
    },
    Toolbar_Group: {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'nowrap',
      margin: '0',
      padding: 0,
      justifyContent: ({ isMultipart, isAssembly }) =>
        isMultipart ? 'space-between' : isAssembly ? 'space-between' : 'center',
    },
    Toolbar_Text: {
      display: 'flex',
    },
    Toolbar_WideText: {
      alignItems: 'center',
      display: ({ isMultipart, isAssembly }) =>
        isMultipart || isAssembly ? 'none' : 'flex',

      [xxl_viewer]: {
        display: 'flex !important',
      },
    },
    Toolbar_ExtraWideText: {
      alignItems: 'center',
      display: 'none',

      [xl]: {
        display: 'flex',
      },
    },
    Toolbar_ResetPill: {
      cursor: 'pointer',
      margin: '0 auto !important',
    },
    Toolbar_IconButton: {
      cursor: 'pointer',
      height: '2rem',
      width: '2rem',
      '&.selected': {
        '& g[opacity]': {
          opacity: '1',
        },
      },
      display: 'none',
    },
    Toolbar_IconButton__selected: {
      display: 'flex',
    },
    Toolbar_RemoveIcon: {
      height: '.75rem',
      width: '.75rem',
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
      maxWidth: ({ isAssembly }) => (isAssembly ? '35rem' : '27.5rem'),
      position: 'relative',

      [md_viewer]: {
        maxWidth: '100%',
      },
    },
  }
})

const Toolbar = ({
  onSnapshot,
  className,
  color,
  isAssembly,
  isMultipart,
  magnitude = 0,
  mode,
  onColorChange,
  onDrawChange,
  onResetView,
  onSliderChange,
  onViewChange,
  orientation,
  partList,
  selectedModel,
  highlightedModel,
  setSelectedModel,
  showPartSelector,
  onHoverPart,
  onLeaveList,
}) => {
  const c = useStyles({ isAssembly, isMultipart })

  return (
    <div className={classnames(c.Toolbar, className)}>
      <Spacer size={'1.5rem'} />
      <div className={c.Toolbar_Group}>
        <div className={c.Toolbar_Text}>
          <Pill secondary onClick={onResetView}>
            <ResetIcon />
            <div className={c.Toolbar_WideText}>
              <Spacer size={'0.25rem'} />
              <span>Reset</span>
            </div>
          </Pill>
          <Spacer size={'1rem'} />
          <Pill secondary onClick={onSnapshot}>
            <CameraDesktopIcon />
            <div className={c.Toolbar_WideText}>
              <Spacer size={'0.25rem'} />
              <span>Snapshot</span>
            </div>
          </Pill>
          <Spacer size={'1.125rem'} />
        </div>
        <div className={c.Toolbar_Text}>
          <div className={c.Toolbar_VerticalRule}></div>
          <Spacer size={'1.125rem'} />
          <div className={c.Toolbar_Group}>
            <div
              className={classnames(c.Toolbar_Text, {
                [c.Toolbar_ExtraWideText]: isAssembly,
              })}
            >
              <MetadataSecondary>Render</MetadataSecondary>
              <Spacer size={'1rem'} />
            </div>
            <DrawModeActionMenu selectedValue={mode} onChange={onDrawChange} />
          </div>
          <div className={c.Toolbar_VerticalRule}></div>
          <Spacer size={'1.125rem'} />
          <div className={c.Toolbar_Group}>
            <div
              className={classnames(c.Toolbar_Text, {
                [c.Toolbar_ExtraWideText]: isAssembly,
              })}
            >
              <MetadataSecondary>Orientation</MetadataSecondary>
              <Spacer size={'1rem'} />
            </div>
            <OrientationActionMenu selectedValue={orientation} onChange={onViewChange} />
          </div>
          <div className={c.Toolbar_VerticalRule}></div>
          <Spacer size={'1.125rem'} />
          <div className={c.Toolbar_Group}>
            <div
              className={classnames(c.Toolbar_Text, {
                [c.Toolbar_ExtraWideText]: isAssembly,
              })}
            >
              <MetadataSecondary>Color</MetadataSecondary>
              <Spacer size={'1rem'} />
            </div>
            <ColorPickerActionMenu selectedValue={color} onChange={onColorChange} />
          </div>
          {isAssembly && (
            <>
              <div className={c.Toolbar_VerticalRule}></div>
              <Spacer size={'1.125rem'} />
              <div className={c.Toolbar_Group}>
                <MetadataSecondary>Explode</MetadataSecondary>
                <Spacer size={'.5rem'} />
                <div className={c.Toolbar_Text}>
                  <Spacer size={'1rem'} />
                  <Slider
                    key={'toolMenu_slider'}
                    onChange={(ev, value) => onSliderChange(value)}
                    value={magnitude}
                  />
                  <Spacer size={'1.125rem'} />
                </div>
              </div>
            </>
          )}
          {showPartSelector && <div className={c.Toolbar_VerticalRule}></div>}
        </div>
        {showPartSelector && (
          <>
            <Spacer size={'1.125rem'} />
            <div className={classnames(c.Toolbar_Group, c.Toolbar_PartExplorerWrapper)}>
              <PartExplorerActionMenu
                onChange={setSelectedModel}
                onHoverPart={onHoverPart}
                onLeave={onLeaveList}
                partList={partList}
                selectedValue={selectedModel}
                highlightedValue={highlightedModel}
              />
            </div>
          </>
        )}
      </div>
      <Spacer size={'1.5rem'} />
    </div>
  )
}

export default Toolbar
