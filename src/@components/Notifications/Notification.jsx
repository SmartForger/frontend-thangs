import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { formatDistanceStrict } from 'date-fns'
import { useCurrentUserId } from '@hooks'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as GrantAccessIcon } from '@svg/notification-grant-access.svg'
import { ReactComponent as HeartIcon } from '@svg/notification-heart.svg'
import { ReactComponent as CommentIcon } from '@svg/notification-comment.svg'
import { ReactComponent as PlusIcon } from '@svg/notification-plus.svg'
import { ReactComponent as UploadIcon } from '@svg/notification-uploaded.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-filled.svg'
import { ReactComponent as PhotoIcon } from '@svg/icon-photo.svg'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    Notification: {},
    Notification_Item: {
      display: 'flex',
    },
    Notification_ActorName: {
      ...theme.text.commentUsername,
      marginBottom: '.5rem',
    },
    Notification_Time: {
      ...theme.text.commentPostedText,
    },
    Notification_Verb: {
      ...theme.text.commentPostedText,
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    Notification_TargetName: {
      ...theme.text.commentPostedText,
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
      width: '100%',
      overflowWrap: 'anywhere',

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
  id: _id,
  actor,
  altVerb,
  count,
  verb,
  time,
  target,
  targetNameAlt,
  linkTarget,
  handleNotificationDelete: _hND,
}) => {
  const actorName = actor && actor.userName
  const targetName = targetNameAlt || (target && target.name)
  const countText =
    count > 1 ? `and ${count - 1} ${count === 2 ? 'other' : 'others'} ` : ''
  return (
    <>
      <div className={c.NotificationSnippet_Wrapper}>
        <Link className={c.NotificationSnippet} to={linkTarget}>
          <div>
            <Icon />
          </div>
          <div className={c.NotificationSnippet_content}>
            <div className={c.NotificationSnippet_text}>
              {`${actorName} `}
              {countText}
              <span className={c.NotificationSnippet_verb}>{altVerb || verb}</span>
              {` ${targetName}`}
            </div>
            <div className={c.NotificationSnippet_time}>{time}</div>
          </div>
        </Link>
      </div>
    </>
  )
}

const Notification = ({ id, actor, className, count, target, timestamp, verb }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const currentUserId = useCurrentUserId()
  const time = formatDistanceStrict(new Date(timestamp), new Date())
  const displayTime = `${time} ago`
  let altVerb = undefined
  let IconComponent = noop
  let linkTarget = '/'
  let targetNameAlt

  const handleNotificationDelete = useCallback(
    id => {
      dispatch(types.CLEAR_NOTIFICATION, { id })
    },
    [dispatch]
  )

  switch (verb) {
    case 'commented':
      IconComponent = CommentIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      break
    case 'downloaded':
      IconComponent = DownloadIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      break
    case 'followed':
      IconComponent = PlusIcon
      linkTarget = target && target.id ? `/u/${target.id}` : '/'
      break
    case 'invited':
      IconComponent = GrantAccessIcon
      linkTarget =
        target && target.id ? `/mythangs/folder/${target.id}` : '/mythangs/shared-files'
      break
    case 'invitedYou':
      IconComponent = GrantAccessIcon
      linkTarget =
        target && target.id ? `/mythangs/folder/${target.id}` : '/mythangs/shared-files'
      altVerb = 'invited you'
      targetNameAlt = 'to a folder'
      break
    case 'liked':
      IconComponent = HeartIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      break
    case 'uploaded':
      IconComponent = UploadIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      break
    case 'uploadedNewVersion':
      IconComponent = UploadIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      altVerb = 'uploaded new version'
      break
    case 'uploaded-to-folder':
      IconComponent = UploadIcon
      linkTarget = target && target.id ? `/mythangs/folder/${target.id}` : '/mythangs'
      altVerb = 'uploaded to folder'
      break
    case 'likedFolder':
      IconComponent = StarIcon
      linkTarget = target && target.id ? `/mythangs/folder/${target.id}` : '/mythangs'
      altVerb = 'liked folder'
      break
    case 'attachmentCreated':
      // Only if another user posts a photo to your model
      IconComponent = PhotoIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      altVerb = 'posted a model photo to'
      break
    case 'attachmentDeleted':
      // Only if owner deletes a photo you posted
      IconComponent = PhotoIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      altVerb = 'deleted your model photo for'
      break
    case 'attachmentApproved':
      IconComponent = PhotoIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      altVerb = 'model photo was approved for'
      break
    case 'attachmentRejected':
      IconComponent = PhotoIcon
      linkTarget = target && target.id ? `/m/${target.id}` : '/'
      altVerb = 'model photo was rejected for'
      break
    default:
      break
  }

  if (verb === 'invitedOther') return null
  const newTargetObj = target
  if (target && target.id && target.id.toString() === currentUserId) {
    newTargetObj.name = 'you'
  }

  const newActor = { ...actor }
  if (newActor.id === currentUserId) {
    if (verb === 'attachmentApproved' || verb === 'attachmentRejected') {
      newActor.name = 'your'
    }
  }
  return (
    <NotificationSnippet
      c={c}
      className={className}
      count={count}
      time={displayTime}
      id={id}
      actor={newActor}
      target={newTargetObj}
      targetNameAlt={targetNameAlt}
      verb={verb}
      altVerb={altVerb}
      linkTarget={linkTarget}
      Icon={IconComponent}
      handleNotificationDelete={handleNotificationDelete}
    />
  )
}

export default Notification
