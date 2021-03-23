/* This is a backup viewer component to the HOOPS viewer
  Controlled by a feature flag stored in localStorage. 
  However we currently have nothing setup to flip that feature flag. 
  
  Decisions needed: 
   - What was the reason to have a backup viewer? 
   - Are those still valid reason? 
   - Can we remove this component?
*/
import React, { useCallback, useState } from 'react'
import { HowTo, Viewer } from '@components'
import { ReactComponent as ShadedIcon } from '@svg/icon-shaded.svg'
import { ReactComponent as CompositeIcon } from '@svg/icon-composite.svg'
import { ReactComponent as WireframeIcon } from '@svg/icon-wireframe.svg'
import { createUseStyles } from '@physna/voxel-ui'

const useStyles = createUseStyles(theme => {
  return {
    ModelViewer: {
      pointerEvents: 'none',
      gridArea: 'viewer',
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '.5rem',
      boxShadow: theme.variables.boxShadow,

      '& > div': {
        pointerEvents: 'all',
      },
    },
    ModelViewer_DisplayButton: {
      cursor: 'pointer',
    },
    ModelViewer_ControlBar: {
      width: '100%',
      height: '5rem',
      backgroundColor: theme.variables.colors.cardBackground,
      borderRadius: '0 0 .5rem .5rem',
      borderTop: `1px ${theme.variables.colors.viewerControlBorderColor} solid`,
      display: 'flex',
      padding: '1.5rem',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    ModelViewer_ControlText: {
      marginRight: '1rem',
      fontWeight: '500',
      fontSize: '75rem',
      color: theme.variables.colors.viewerControlText,
    },
    ModelViewer_ButtonGroup: {
      display: 'flex',
      alignItems: 'center',

      '& > div + div': {
        marginLeft: '1rem',
      },
    },
    ModelViewer_Placeholder: {
      height: '1rem',
      width: '5.5rem',
      marginLeft: '9.5rem',
    },
  }
})

const ModelViewerDisplay = ({ model, className }) => {
  const [mode, setMode] = useState('composite')
  const [meshColor] = useState('#ffbc00')
  const [wireColor] = useState('#014d7c')
  const c = useStyles()

  const changeMode = useCallback(
    targetMode => {
      setMode(targetMode)
    },
    [setMode]
  )

  return (
    <div className={className}>
      <Viewer
        url={model.attachment && model.attachment.dataSrc}
        mode={mode}
        meshColor={meshColor}
        wireFrameColor={wireColor}
        boxShadow='none'
      />

      <div className={c.ModelViewer_ControlBar}>
        <div className={c.ModelViewer_ButtonGroup}>
          <div className={c.ModelViewer_ControlText}>MODEL VIEW</div>
          <div
            className={c.ModelViewer_button}
            onClick={() => {
              changeMode('shaded')
            }}
          >
            <ShadedIcon />
          </div>
          <div
            className={c.ModelViewer_button}
            onClick={() => {
              changeMode('wireframe')
            }}
          >
            <WireframeIcon />
          </div>
          <div
            className={c.ModelViewer_button}
            onClick={() => {
              changeMode('composite')
            }}
          >
            <CompositeIcon />
          </div>
        </div>
        <div className={c.ModelViewer_Placeholder} />
      </div>
    </div>
  )
}

const ModelViewer = ({ model, className }) => {
  const [seenHowTo, setSeenHowTo] = useState(true) //useLocalStorage('seenHowTo', false)

  return seenHowTo ? (
    <ModelViewerDisplay model={model} className={className} />
  ) : (
    <div className={className}>
      <HowTo setSeenHowTo={setSeenHowTo} />
    </div>
  )
}

export default ModelViewer
