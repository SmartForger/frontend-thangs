import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as FeedbackIcon } from '@svg/icon-feedback.svg'
import { ContainerColumn, ContainerRow, Spacer, Tooltip } from '@components'

const FEEDBACK_FORM_URL = 'https://forms.gle/7p7GhexnzCgZ4cVN6'

const useStyles = createUseStyles(theme => {
  return {
    FeedbackTooltip: {
      backgroundColor: theme.colors.gold[500],
      borderRadius: '2rem',
      width: '2.5rem',
      height: '2.5rem',
      position: 'fixed',
      bottom: '3rem',
      right: '2rem',
      zIndex: '1',
    },
    FeedbackTooltip_Icon: {
      color: theme.colors.black[500],
    },
    FeedbackTooltip_Link: {
      height: '1rem',
    },
    FeedbackTooltip_Message: {
      backgroundColor: `${theme.colors.white[100]} !important`,
      opacity: '1 !important',
      color: `${theme.colors.black[500]} !important`,
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      borderRadius: '0.5rem',
      ...theme.text.viewerLoadingText,
      padding: '1rem 1rem',
      '&.place-top': {
        '&:after': {
          borderTopColor: `${theme.colors.white[500]} !important`,
        },
      },
      '&.place-left': {
        '&:after': {
          borderLeftColor: `${theme.colors.white[500]} !important`,
        },
      },
    },
  }
})

const FeedbackTooltip = () => {
  const c = useStyles()
  return (
    <>
      <div className={c.FeedbackTooltip}>
        <Tooltip
          title={'Help us improve! Give us your feedback.'}
          arrowLocation={'right'}
        >
          <ContainerColumn alignItems='center'>
            <Spacer size='.75rem' />
            <ContainerRow alignItems='center'>
              <Spacer size='.75rem' />
              <a
                href={FEEDBACK_FORM_URL}
                target='_blank'
                rel='noopener noreferrer'
                className={c.FeedbackTooltip_Link}
              >
                <FeedbackIcon className={c.FeedbackTooltip_Icon} />
              </a>
              <Spacer size='.75rem' />
            </ContainerRow>
            <Spacer size='.75rem' />
          </ContainerColumn>
        </Tooltip>
      </div>
    </>
  )
}

export default FeedbackTooltip
