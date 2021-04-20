import React, { useCallback, useEffect } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { Spacer } from '@components'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useOverlay } from '@hooks'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Report: {
      height: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      minHeight: '30rem',

      [md]: {
        height: 'unset',
      },
    },
    Report_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',

      [md]: {
        flexDirection: 'row',
        height: 'unset',
      },
    },
    Report_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
    },
    Report_ViewerWrapper: {
      width: '100%',
      height: '24rem',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
      borderRadius: '1rem 1rem 0 0',
      position: 'relative',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.colors.white[900]}`,

      [md]: {
        height: '40rem',
        borderBottom: 'none',
        borderRight: `1px solid ${theme.colors.white[900]}`,
        borderRadius: '1rem 0 0 1rem',
      },
    },
    Report_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    Report_Wrapper: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        width: '339px',
      },

      '& #ff-compose': {
        width: 'calc(100% - 1rem)',
      },
    },
    Report_LoaderScreen: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: '5',
      borderRadius: '1rem',
      display: 'flex',
    },
  }
})

const Report = ({ attachmentId }) => {
  const c = useStyles()

  const { setOverlayOpen } = useOverlay()

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  useEffect(() => {
    overlayview('Report')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.Report}>
      <ExitIcon className={c.Report_ExitButton} onClick={closeOverlay} />
      <Spacer size='4rem' />
      <div className={classnames(c.Report_Column, c.Report_EditForm)}>
        <iframe
          title='Report Upload'
          src={`https://docs.google.com/forms/d/e/1FAIpQLSdhD649tDEuS_dhJYl0VAst-Sjgmu9mHfysv3kaPfjMywL6hA/viewform?entry.1683063574=${document.location.href}&entry.1433027243=${attachmentId}&embedded=true`}
          width='640'
          height='883'
          frameBorder='0'
          marginHeight='0'
          marginWidth='0'
        >
          Loading…
        </iframe>
      </div>
    </div>
  )
}

export default Report
