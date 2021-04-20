import React, { useCallback } from 'react'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { Button, Spacer, Spinner } from '@components'
import { useOverlay } from '@hooks'

import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    overlayWrapper: {
      minHeight: '27.75rem',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      width: '100%',

      [md]: {
        width: '27.75rem',
      },
    },
    OverlayWrapper_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      minWidth: 0,
    },
    OverlayWrapper_OverlayHeader: {
      lineHeight: '1.5rem !important',
    },
    OverlayWrapper_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    OverlayWrapper_BackButton: {
      top: '1.5rem',
      left: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    OverlayWrapper_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    OverlayWrapper_Column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    OverlayWrapper_LoaderScreen: {
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
    OverlayWrapper__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    OverlayWrapper_ButtonWrapper: {
      alignSelf: 'normal',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    OverlayWrapper_ButtonSpacer: {
      flex: 'none',
    },
  }
})
const noop = () => null

const OverlayWrapper = ({
  isLoading,
  overlayHeader,
  overlayTitle,
  overlaySubTitle,
  children,
  dataCy,
  onBack,
  onCancel,
  onClose = noop,
  onContinue,
  cancelText = 'Close',
  continueText = 'Continue',
  hideButtons,
}) => {
  const c = useStyles({})
  const { setOverlayOpen } = useOverlay()

  const closeOverlay = useCallback(() => {
    onClose()
    setOverlayOpen(false)
  }, [onClose, setOverlayOpen])

  return (
    <div className={c.overlayWrapper} data-cy={dataCy}>
      {isLoading && (
        <div className={c.OverlayWrapper_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <Spacer size={'2rem'} />
      <div className={c.OverlayWrapper_Content}>
        <div className={c.OverlayWrapper_Column}>
          <Spacer size={'1.5rem'} />
          <div className={c.OverlayWrapper_Row}>
            <Body className={c.OverlayWrapper_OverlayHeader}>{overlayHeader}</Body>
            {onBack && (
              <ArrowLeftIcon className={c.OverlayWrapper_BackButton} onClick={onBack} />
            )}
            <ExitIcon className={c.OverlayWrapper_ExitButton} onClick={closeOverlay} />
          </div>
          <Spacer size={'1.5rem'} />
        </div>
        {overlayTitle && (
          <>
            <Title headerLevel={HeaderLevel.tertiary}>{overlayTitle}</Title>
            <Spacer size={'.5rem'} />
          </>
        )}
        {overlaySubTitle && (
          <>
            <Body multiline>{overlaySubTitle}</Body>
            <Spacer size={'1rem'} />
          </>
        )}
        {children}
        {!hideButtons && (onContinue || onCancel) ? (
          <div className={c.OverlayWrapper_ButtonWrapper}>
            {onCancel && (
              <>
                <Button tertiary onClick={onCancel}>
                  {cancelText}
                </Button>
                <Spacer size={'1rem'} className={c.OverlayWrapper_ButtonSpacer} />
              </>
            )}
            {onContinue && (
              <Button onClick={onContinue} disabled={isLoading}>
                {isLoading ? 'Processing...' : continueText}
              </Button>
            )}
          </div>
        ) : null}
        <Spacer size={'2rem'} className={c.OverlayWrapper__desktop} />
      </div>
      <Spacer size={'2rem'} />
    </div>
  )
}

export default OverlayWrapper
