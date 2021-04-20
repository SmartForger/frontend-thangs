import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import {
  ContainerRow,
  ContainerColumn,
  DotStackActionMenu,
  Markdown,
  Spacer,
  UserInline,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import ArrowLeftIcon from '@svg/IconArrowLeft'
import ArrowRightIcon from '@svg/IconArrowRight'
import TrashCanIcon from '@svg/TrashCanIcon'
import { useOverlay, useCurrentUserId } from '@hooks'
import { overlayview } from '@utilities/analytics'
import * as types from '@constants/storeEventTypes'

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
      },
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
      flexDirection: 'row',
    },
    AttachmentView_CaptionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      overflowWrap: 'anywhere',
    },
    AttachmentView_CaptionPosition: {
      color: theme.colors.black[300],
      fontSize: '0.75rem',
      lineHeight: '2',
      minWidth: '2rem',
    },
    AttachmentView_NavigationArrow: {
      cursor: 'pointer',
    },
    AttachmentView_RemoveLink: {
      cursor: 'pointer',
      fontWeight: 500,
      color: theme.colors.white[300],
    },
    AttachmentView_ReportLink: {
      cursor: 'pointer',
      fontWeight: 500,
      color: theme.colors.white[300],
    },
  }
})

const AttachmentView = ({ initialAttachmentIndex, modelOwnerId }) => {
  const c = useStyles()
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(
    initialAttachmentIndex
  )
  const { dispatch, modelAttachments = {} } = useStoreon('modelAttachments')
  const { data: attachments } = modelAttachments
  const { setOverlayOpen, setOverlay } = useOverlay()

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const activeAttachment = useMemo(() => attachments[activeAttachmentIndex], [
    attachments,
    activeAttachmentIndex,
  ])

  const attachmentPosition = useMemo(() => {
    const attachmentsLength = attachments.length
    return `${activeAttachmentIndex + 1} / ${attachmentsLength}`
  }, [attachments, activeAttachmentIndex])

  const hasPreviousAttachment = useMemo(() => {
    return activeAttachmentIndex > 0
  }, [activeAttachmentIndex])

  const hasNextAttachment = useMemo(() => {
    return activeAttachmentIndex + 1 < attachments.length
  }, [attachments, activeAttachmentIndex])

  useEffect(() => {
    overlayview('AttachmentView')
  })

  const handleRemove = useCallback(
    (attachmentId, modelId) => {
      dispatch(types.DELETE_MODEL_ATTACHMENT, {
        attachmentId,
        modelId,
        onFinish: updatedAttachments => {
          const attachmentAtCurrentIndex = updatedAttachments[activeAttachmentIndex]
          const attachmentAtPreviousIndex = updatedAttachments[activeAttachmentIndex - 1]
          if (attachmentAtCurrentIndex?.id) {
            return
          } else if (attachmentAtPreviousIndex?.id) {
            setActiveAttachmentIndex(prevVal => prevVal - 1)
          } else {
            closeOverlay()
          }
        },
      })
    },
    [dispatch, activeAttachmentIndex, setActiveAttachmentIndex, closeOverlay]
  )

  const handleReport = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'report',
      data: {
        animateIn: true,
        windowed: true,
        dialogue: true,
        attachmentId: activeAttachment.id,
      },
    })
  }, [setOverlay, activeAttachment.id])

  const currentUserId = useCurrentUserId()
  const userCanRemoveImage = useMemo(() => {
    const attachmentOwnerId = activeAttachment?.owner?.id
    if (!modelOwnerId || !attachmentOwnerId) return false
    return [`${modelOwnerId}`, attachmentOwnerId].includes(currentUserId)
  }, [modelOwnerId, activeAttachment, currentUserId])

  const AttachmentOptions = () => {
    const REPORT = 'report'

    const options = [
      {
        label: 'Report',
        value: REPORT,
      },
    ]

    const handleSelect = eventType => {
      switch (eventType) {
        case REPORT:
          handleReport(activeAttachment.id)
          break
        default:
          break
      }
    }

    return (
      <DotStackActionMenu options={options} onChange={handleSelect} color='#FFFFFF' />
    )
  }

  return (
    <ContainerRow>
      <ContainerRow alignItems='center'>
        {hasPreviousAttachment && (
          <ArrowLeftIcon
            color={'#FFFFFF'}
            className={c.AttachmentView_NavigationArrow}
            onClick={() => setActiveAttachmentIndex(prevVal => prevVal - 1)}
          />
        )}
        <Spacer size='1rem' />
      </ContainerRow>
      <ContainerColumn>
        <div className={c.AttachmentView}>
          <div className={c.AttachmentView_Content}>
            <div className={c.AttachmentView_Column}>
              <Spacer size={'1rem'} />
              <div className={c.AttachmentView_Row}>
                <Spacer size={'1.5rem'} />
                <UserInline
                  user={activeAttachment.owner}
                  className={c.AttachmentView_UserInfo}
                  size='2.5rem'
                />
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
                  <Markdown>{activeAttachment.caption}</Markdown>
                  <Spacer width={'0.5rem'} />
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
        <ContainerColumn>
          <Spacer size='0.5rem' />
          <ContainerRow justifyContent='flex-end'>
            {userCanRemoveImage && (
              <>
                <ContainerRow
                  className={c.AttachmentView_RemoveLink}
                  onClick={() =>
                    handleRemove(activeAttachment.id, activeAttachment.modelId)
                  }
                >
                  <TrashCanIcon color='#FFFFFF' />
                  <Spacer size='0.25rem' />
                  Remove
                </ContainerRow>
                <Spacer size='0.5rem' />
              </>
            )}
            <ContainerRow className={c.AttachmentView_ReportLink}>
              <AttachmentOptions />
            </ContainerRow>
          </ContainerRow>
        </ContainerColumn>
      </ContainerColumn>
      <ContainerRow alignItems='center'>
        <Spacer size='1rem' />
        {hasNextAttachment && (
          <ArrowRightIcon
            color='#FFFFFF'
            className={c.AttachmentView_NavigationArrow}
            onClick={() => setActiveAttachmentIndex(prevVal => prevVal + 1)}
          />
        )}
      </ContainerRow>
    </ContainerRow>
  )
}

export default AttachmentView
