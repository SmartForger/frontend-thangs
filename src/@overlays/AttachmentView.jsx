import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { ContainerRow, ContainerColumn, MultiLineBodyText, Spacer, UserInline } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import ArrowLeftIcon from '@svg/icon-arrow-left'
import ArrowRightIcon from '@svg/icon-arrow-right'
import { useOverlay } from '@hooks'
import { overlayview } from '@utilities/analytics'

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
      top: '1.75rem',
      right: '1.75rem',
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
    AttachmentView_CaptionPosition: {
      color: theme.colors.black[300],
      fontSize: '0.75rem',
      lineHeight: '2',
      minWidth: '2rem',
    },
    AttachmentView_NavigationArrow: {
      cursor: 'pointer',
    }
  }
})

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
  })

  return (
    <ContainerRow>
      <ContainerRow alignItems='center'>
        <ArrowLeftIcon
          color={'#FFFFFF'}
          className={c.AttachmentView_NavigationArrow}
          onClick={() => setActiveAttachmentIndex(prevVal => prevVal - 1)}
        />
        <Spacer size='1rem' />
      </ContainerRow>
      <div className={c.AttachmentView}>
        <div className={c.AttachmentView_Content}>
          <div className={c.AttachmentView_Column}>
            <Spacer size={'1rem'} />
            <div className={c.AttachmentView_Row}>
              <Spacer size={'1.5rem'} />
              <UserInline user={activeAttachment.owner} className={c.AttachmentView_UserInfo} size='2.5rem' />
            </div>
            <ExitIcon className={c.AttachmentView_ExitButton} onClick={closeOverlay} />
            <Spacer size={'1rem'} />
          </div>
          <img
            className={c.AttachmentView_Image}
            alt={activeAttachment.caption}
            src={activeAttachment.imageUrl}
          />
          <div>
            <Spacer size={'1.5rem'} />
            <div className={c.AttachmentView_CaptionRow}>
              <Spacer width={'1.5rem'} />
              <div className={c.AttachmentView_CaptionWrapper}>
                <MultiLineBodyText>
                  {activeAttachment.caption}
                </MultiLineBodyText>
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
      <ContainerRow alignItems='center'>
        <Spacer size='1rem' />
        <ArrowRightIcon
          color={'#FFFFFF'}
          className={c.AttachmentView_NavigationArrow}
          onClick={() => setActiveAttachmentIndex(prevVal => prevVal + 1)}
        />
      </ContainerRow>
    </ContainerRow>
  )
}

export default AttachmentView
