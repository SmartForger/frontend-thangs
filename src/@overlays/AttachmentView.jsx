import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Spacer, Spinner, UserInline } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { useOverlay } from '@hooks'
import { overlayview, track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    AttachmentView: {
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
    AttachmentView_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    AttachmentView_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    AttachmentView_UserInfo: {
      '& span': {
        fontSize: '1rem',
      }
    },
    AttachmentView_ExitButton: {
      top: '1.5rem',
      right: '1.5rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
      background: 'white',
    },
    AttachmentView_Content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      minWidth: 0,
    },
    AttachmentView_Image: {
      width: '100%',
    },
    AttachmentView_CaptionRow: {
      display: 'flex',
      flexDirection: 'row'
    },
    AttachmentView_CaptionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    AttachmentView_CaptionText: {
      color: theme.colors.black[300]
    },
    AttachmentView_CaptionPosition: {
      color: theme.colors.black[300],
      fontSize: '12px',
    }
  }
})

const noop = () => null

const AttachmentView = ({ initialAttachmentIndex, attachments }) => {
  const c = useStyles()
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(initialAttachmentIndex)
  const { setOverlayOpen } = useOverlay()

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const activeAttachment = useMemo(
    () => attachments[activeAttachmentIndex],
    [attachments, activeAttachmentIndex]
  )

  const attachmentPosition = useMemo(() => {
    const attachmentsLength = attachments.length;
    return `${activeAttachmentIndex + 1} / ${attachmentsLength}`
  }, [attachments, activeAttachmentIndex])

  useEffect(() => {
    overlayview('AttachmentView')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.AttachmentView}>
      <div className={c.AttachmentView_Content}>
        <div className={c.AttachmentView_Column}>
          <Spacer size={'0.75rem'} />
          <div className={c.AttachmentView_Row}>
            <Spacer size={'1.5rem'} />
            <UserInline user={activeAttachment.owner} className={c.AttachmentView_UserInfo} size='2.5rem' />
          </div>
          <ExitIcon className={c.AttachmentView_ExitButton} onClick={closeOverlay} />
          <Spacer size={'0.75rem'} />
        </div>
        <img
          className={c.AttachmentView_Image}
          src={activeAttachment.imageUrl}
        />
        <div>
          <Spacer size={'1.5rem'} />
          <div className={c.AttachmentView_CaptionRow}>
            <Spacer width={'1.5rem'} />
            <div className={c.AttachmentView_CaptionWrapper}>
              <div className={c.AttachmentView_CaptionText}>
                {activeAttachment.caption}
              </div>
              <div className={c.AttachmentView_CaptionPosition}>
                {attachmentPosition}
              </div>
            </div>
            <Spacer width={'1.5rem'} />
          </div>
          <Spacer size={'1.5rem'} />
        </div>
      </div>
    </div>
  )
}

export default AttachmentView
