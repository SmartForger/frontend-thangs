import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import {
  isModelCompletedProcessing,
  isModelFailedProcessing,
  isUserCommentedOnModel,
  isUserLikedModel,
  isUserUploadedModel,
  isUserStartedFollowingUser,
  isUserGrantedUserAccessToFolder,
} from '@services/graphql-service/notifications'
import { ReactComponent as HeartIcon } from '@svg/notification-heart.svg'
import { ReactComponent as CommentIcon } from '@svg/notification-comment.svg'
import { ReactComponent as PlusIcon } from '@svg/notification-plus.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Notification: {},
    Notification_Item: {
      display: 'flex',
    },
    Notification_ActorName: {
      ...theme.mixins.text.commentUsername,
      marginBottom: '.5rem',
    },
    Notification_Time: {
      ...theme.mixins.text.commentPostedText,
    },
    Notification_Verb: {
      ...theme.mixins.text.commentPostedText,
      textTransform: 'capitalize',
      fontWeight: 600,
    },
    Notification_TargetName: {
      ...theme.mixins.text.commentPostedText,
    },
    Notification_TargetPicture: {
      width: '11.75rem',
      height: '7.5rem',
    },
    Notification_Thumbnail: {
      borderRadius: '.5rem',
      '& svg': {
        width: '2.5rem',
        height: '2.5rem',
      },
    },
    Notification_LogoContainer: {
      height: '3rem',
      minWidth: '3rem',
      maxWidth: '3rem',
      borderRadius: '100%',
      backgroundColor: theme.colors.purple[900],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& img': {
        width: '80%',
      },
    },
    Notification_Image: {
      maxWidth: '1.5rem',
    },
    Notification_Text: {
      marginTop: '1rem',
    },
    Notification_TruncateOverflow: {
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
    },
    NotificationSnippet: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '1.5rem',
      alignItems: 'flex-start',
      padding: '.5rem',
      borderRadius: '.5rem',
      width: '15rem',

      '&:hover': {
        backgroundColor: theme.colors.white[700],
        borderRadiu: '.5rem',
      },
    },
    NotificationSnippet_content: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '.5rem',
      color: theme.colors.grey[600],
    },
    NotificationSnippet_text: {
      fontWeight: '600',
      lineHeight: '125%',
    },
    NotificationSnippet_verb: {
      fontWeight: 'normal',
    },
    NotificationSnippet_time: {
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '.25rem',
      color: theme.colors.grey[300],
    },
    Notification_HeartIcon: {
      fill: theme.colors.gold[500],
      stroke: theme.colors.gold[500],
    },
  }
})
const noop = () => null
const NotificationSnippet = ({
  c,
  Icon = noop,
  actor,
  verb,
  time,
  target,
  linkTarget,
}) => {
  const actorName = actor && actor.name
  const targetName = target && target.name
  return (
    <Link className={c.NotificationSnippet} to={linkTarget}>
      <div>
        <Icon />
      </div>
      <div className={c.NotificationSnippet_content}>
        <div className={c.NotificationSnippet_text}>
          {`${actorName} `}
          <span className={c.NotificationSnippet_verb}>{verb}</span>
          {` ${targetName}`}
        </div>
        <div className={c.NotificationSnippet_time}>{time}</div>
      </div>
    </Link>
  )
}

const Notification = ({
  timestamp,
  actor,
  verb,
  target,
  notificationType,
  actionObject,
  className,
}) => {
  const c = useStyles()
  const time = formatDistanceStrict(new Date(timestamp), new Date())
  const displayTime = `${time} ago`
  let text = ''
  let IconComponent = noop
  let linkTarget = '/'
  if (isModelFailedProcessing(notificationType)) {
    text = 'We were unable to process your model. Please try again.'
  } else if (isModelCompletedProcessing(notificationType)) {
    text = 'We have finished processing your model.'
  } else if (isUserCommentedOnModel(notificationType)) {
    text = actionObject && actionObject.body
    IconComponent = CommentIcon
    linkTarget = target && target.id ? `/model/${target.id}` : '/'
  } else if (isUserLikedModel(notificationType)) {
    IconComponent = HeartIcon
    linkTarget = target && target.id ? `/model/${target.id}` : '/'
  } else if (isUserStartedFollowingUser(notificationType)) {
    IconComponent = PlusIcon
  } else if (isUserUploadedModel(notificationType)) {
    IconComponent = PlusIcon
  } else if (isUserGrantedUserAccessToFolder(notificationType)) {
    IconComponent = PlusIcon
  }
  return (
    <NotificationSnippet
      c={c}
      className={className}
      time={displayTime}
      actor={actor}
      target={target}
      verb={verb}
      text={text}
      linkTarget={linkTarget}
      Icon={IconComponent}
    />
  )
}

export default Notification
