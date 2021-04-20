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
import { useOverlay, useCurrentUserId, useIsMobile } from '@hooks'
import { overlayview } from '@utilities/analytics'
import classnames from 'classnames'

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
      width: '100%',
      overflowWrap: 'anywhere',
      justifyContent: 'flex-end',
      alignItems: 'center',
      [md]: {
        justifyContent: 'normal',
      },
    },
    AttachmentView_CaptionPosition: {
      color: theme.colors.black[300],
      fontSize: '0.75rem',
      lineHeight: '2',
      minWidth: '2rem',
    },
    AttachmentView_NavigationArrow: {
      cursor: 'pointer',
      '& > path': {
        fill: theme.colors.black[500],
      },
      [md]: {
        '& > path': {
          fill: theme.colors.white[400],
        },
      },
    },
    AttachmentView_RemoveLink: {
      cursor: 'pointer',
      fontWeight: 500,
      color: theme.colors.black[500],
      [md]: {
        color: theme.colors.white[300],
      },
    },
    AttachmentView_ReportLink: {
      cursor: 'pointer',
      fontWeight: 500,
      color: theme.colors.white[300],
    },
    AttachmentView_Caption: {
      width: '100%',
    },
    Navigation_Mobile: {
      padding: '0 1rem',

      [md]: {
        padding: 0,
      },
    },
    Navigation_MobileArrowWrapper: {
      width: '100%',
      justifyContent: 'flex-end !important',

      [md]: {
        width: 'unset',
        justifyContent: 'unset',
        alignItems: 'center !important',
      },
    },
    Navigation_MobileArrowWrapper_hasPrev: {
      justifyContent: 'space-between !important',
    },
  }
})

const AttachmentView = ({ initialAttachmentIndex, modelOwnerId, modelId }) => {
  const c = useStyles()
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(
    initialAttachmentIndex
  )
  const { modelAttachments = {} } = useStoreon('modelAttachments')
  const { data: attachments } = modelAttachments
  const { setOverlayOpen, setOverlay } = useOverlay()
  const isMobile = useIsMobile(640)

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

  const handleRemove = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'deleteAttachment',
      data: {
        animateIn: true,
        windowed: true,
        dialogue: true,
        modelId,
        activeAttachment,
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
      },
    })
  }, [setOverlay, modelId, activeAttachment, activeAttachmentIndex, closeOverlay])

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
      <DotStackActionMenu
        options={options}
        onChange={handleSelect}
        color={isMobile ? '#000000' : '#FFFFFF'}
      />
    )
  }

  const MagicContainer = ({ className, children }) => {
    if (isMobile) {
      return <ContainerColumn className={className}>{children}</ContainerColumn>
    } else {
      return <ContainerRow className={className}>{children}</ContainerRow>
    }
  }

  return (
    <MagicContainer>
      {!isMobile && (
        <ContainerRow alignItems='center' className={c.AttachmentView_Arrow}>
          {hasPreviousAttachment && (
            <ArrowLeftIcon
              color={'#FFFFFF'}
              className={c.AttachmentView_NavigationArrow}
              onClick={() => setActiveAttachmentIndex(prevVal => prevVal - 1)}
            />
          )}
          <Spacer size='1rem' />
        </ContainerRow>
      )}
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
                  <Markdown className={c.AttachmentView_Caption}>
                    {activeAttachment.caption}
                  </Markdown>
                  <Spacer width={'0.5rem'} />
                  <div className={c.AttachmentView_CaptionPosition}>
                    {attachmentPosition}
                  </div>
                  {isMobile && (
                    <ContainerRow className={c.AttachmentView_ReportLink}>
                      <AttachmentOptions />
                    </ContainerRow>
                  )}
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
                  <TrashCanIcon color={isMobile ? '#000000' : '#FFFFFF'} />
                  <Spacer size='0.25rem' />
                  Remove
                </ContainerRow>
                <Spacer size='0.5rem' />
              </>
            )}
            {!isMobile && (
              <ContainerRow className={c.AttachmentView_ReportLink}>
                <AttachmentOptions />
              </ContainerRow>
            )}
          </ContainerRow>
        </ContainerColumn>
      </ContainerColumn>
      <MagicContainer className={c.Navigation_Mobile}>
        <Spacer size='1rem' />
        <ContainerRow
          className={classnames(c.Navigation_MobileArrowWrapper, {
            [c.Navigation_MobileArrowWrapper_hasPrev]: hasPreviousAttachment,
          })}
        >
          {isMobile && hasPreviousAttachment && (
            <ArrowLeftIcon
              color={'#FFFFFF'}
              className={c.AttachmentView_NavigationArrow}
              onClick={() => setActiveAttachmentIndex(prevVal => prevVal - 1)}
            />
          )}
          {hasNextAttachment && (
            <ArrowRightIcon
              color='#FFFFFF'
              className={c.AttachmentView_NavigationArrow}
              onClick={() => setActiveAttachmentIndex(prevVal => prevVal + 1)}
            />
          )}
        </ContainerRow>
      </MagicContainer>
    </MagicContainer>
  )
}

export default AttachmentView
