import React from 'react'
import { createUseStyles } from '@physna/voxel-ui'
import { ReactComponent as FeedbackIcon } from '@svg/icon-feedback.svg'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'

const FEEDBACK_FORM_URL = 'https://forms.gle/7p7GhexnzCgZ4cVN6'

const useStyles = createUseStyles(theme => {
  return {
    FeedbackTooltip: {
      backgroundColor: theme.colors.gold[500],
      borderRadius: '2rem',
      width: '2.5rem',
      height: '2.5rem',
    },
    FeedbackTooltip_Icon: {
      color: theme.colors.black[500],
      position: 'absolute',
      top: '0.75rem',
      left: '0.75rem',
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

const FeedbackTooltip = ({ className }) => {
  const c = useStyles()
  return (
    <>
      <a
        href={FEEDBACK_FORM_URL}
        target='_blank'
        rel='noopener noreferrer'
        className={classnames(className, c.FeedbackTooltip)}
        data-for='custom-class'
        data-tip='Help us improve! Give us your feedback.'
      >
        <FeedbackIcon className={c.FeedbackTooltip_Icon} />
      </a>
      <ReactTooltip
        id='custom-class'
        className={c.FeedbackTooltip_Message}
        place={'top'}
        effect='solid'
      />
    </>
  )
}

export default FeedbackTooltip
