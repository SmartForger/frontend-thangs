import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { formatDistanceStrict } from 'date-fns'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as GrantAccessIcon } from '@svg/notification-grant-access.svg'
import { ReactComponent as HeartIcon } from '@svg/notification-heart.svg'
import { ReactComponent as CommentIcon } from '@svg/notification-comment.svg'
import { ReactComponent as PlusIcon } from '@svg/notification-plus.svg'
import { ReactComponent as UploadIcon } from '@svg/notification-uploaded.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

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
    NotificationSnippet_Wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    NotificationSnippet: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '.5rem',
      borderRadius: '.5rem',
      width: '15rem',

      '&:hover': {
        backgroundColor: theme.colors.white[800],
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
    NotificationSnippet_TrashIcon: {
      padding: '.5rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.colors.white[800],
        borderRadiu: '.5rem',
      },
    },
  }
})
const noop = () => null

const NotificationSnippet = ({
  c,
  Icon = noop,
  id,
  actor,
  count,
  verb,
  time,
  target,
  linkTarget,
  handleNotificationDelete,
}) => {
  const actorName = actor && actor.userName
  const targetName = target && target.name
  const countText =
    count > 1 ? `and ${count - 1} ${count === 2 ? 'other' : 'others'} ` : ''
  return (
    <div className={c.NotificationSnippet_Wrapper}>
      <Link className={c.NotificationSnippet} to={linkTarget}>
        <div>
          <Icon />
        </div>
        <div className={c.NotificationSnippet_content}>
          <div className={c.NotificationSnippet_text}>
            {`${actorName} `}
            {countText}
            <span className={c.NotificationSnippet_verb}>{verb}</span>
            {` ${targetName}`}
          </div>
          <div className={c.NotificationSnippet_time}>{time}</div>
        </div>
      </Link>
      <TrashCanIcon
        className={c.NotificationSnippet_TrashIcon}
        onClick={() => handleNotificationDelete(id)}
      />
    </div>
  )
}

const Notification = ({ id, actor, className, count, target, timestamp, verb }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const time = formatDistanceStrict(new Date(timestamp), new Date())
  const displayTime = `${time} ago`
  let text = ''
  let IconComponent = noop
  let linkTarget = '/'

  const handleNotificationDelete = useCallback(
    id => {
      dispatch(types.CLEAR_NOTIFICATION, { id })
    },
    [dispatch]
  )

  switch (verb) {
    case 'commented':
      IconComponent = CommentIcon
      linkTarget = target && target.id ? `/model/${target.id}` : '/'
      break
    case 'downloaded':
      IconComponent = DownloadIcon
      linkTarget = target && target.id ? `/model/${target.id}` : '/'
      break
    case 'followed':
      IconComponent = PlusIcon
      linkTarget = target && target.id ? `/user/${target.id}` : '/'
      break
    case 'invited':
      IconComponent = GrantAccessIcon
      linkTarget = target && target.id ? `/folder/${target.id}` : '/'
      break
    case 'liked':
      IconComponent = HeartIcon
      linkTarget = target && target.id ? `/model/${target.id}` : '/'
      break
    case 'uploaded':
      IconComponent = UploadIcon
      linkTarget = target && target.id ? `/model/${target.id}` : '/'
      break
    case 'uploaded-new-version':
      IconComponent = UploadIcon
      linkTarget = target && target.id ? `/model/${target.id}` : '/'
      break
    case 'uploaded-to-folder':
      IconComponent = UploadIcon
      linkTarget = target && target.id ? `/folder/${target.id}` : '/'
      break
    default:
      break
  }

  return (
    <NotificationSnippet
      c={c}
      className={className}
      count={count}
      time={displayTime}
      id={id}
      actor={actor}
      target={target}
      verb={verb}
      text={text}
      linkTarget={linkTarget}
      Icon={IconComponent}
      handleNotificationDelete={handleNotificationDelete}
    />
  )
}

export default Notification
