import React from 'react'
import { Link } from 'react-router-dom'
import * as DateFns from 'date-fns'
import { ProfilePicture } from '@components/ProfilePicture'
import { ModelThumbnail } from '@components/ModelThumbnail'
import { Card } from '@components/Card'
import {
  isModelCompletedProcessing,
  isModelFailedProcessing,
  isUserCommentedOnModel,
  isUserUploadedModel,
  isUserStartedFollowingUser,
  isUserGrantedUserAccessToFolder,
} from '@services/graphql-service/notifications'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Notification: {},
    Notification_Item: {
      display: 'flex',
    },
    Notification_Left: {
      minWidth: '3rem',
    },
    Notification_Right: {
      minWidth: '11.75rem',
    },
    Notification_Content: {
      margin: '1rem 0 0 1rem',
      maxWidth: 'calc(100% - 11.75rem - 3rem)',
      minWidth: 'calc(100% - 11.75rem - 3rem)',

      '& span + span': {
        marginLeft: '.5rem',
      },
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
  }
})

const DATE_FORMAT = 'h:mmaaaa M/dd/yy'

function Body({ left, content, right, className }) {
  const c = useStyles()
  return (
    <li className={classnames(className, c.Notification_Item)}>
      <div className={c.Notification_Left}>{left}</div>
      <div className={c.Notification_Content}>{content}</div>
      <div className={c.Notification_Right}>{right}</div>
    </li>
  )
}

function ActorPicture({ id, name, img }) {
  return (
    <Link to={`/profile/${id}`}>
      <ProfilePicture size='48px' name={name} src={img} />
    </Link>
  )
}

function formatDate(time) {
  const formatted = DateFns.format(new Date(time), DATE_FORMAT)
  return formatted.replace('a.m.', 'am').replace('p.m.', 'pm')
}

function ThangsPicture() {
  const c = useStyles()
  return (
    <div className={c.Notification_LogoContainer}>
      <img className={c.Notification_Image} src='/thangs-logo.png' alt='Thangs logo' />
    </div>
  )
}

function ModelCompletedProcessing({ className, time, actor }) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={<ThangsPicture />}
      content={
        <div>
          <div className={c.Notification_ActorName}>Thangs</div>
          <span className={c.Notification_Time}>{time}</span>
          <div className={c.Notification_Text}>
            We have finished processing your model.
          </div>
        </div>
      }
      right={
        <Link to={`/model/${actor.id}`}>
          <Card className={c.Notification_TargetPicture}>
            <ModelThumbnail
              className={c.Notification_Thumbnail}
              thumbnailUrl={actor.thumbnailUrl}
              name={actor.name}
            />
          </Card>
        </Link>
      }
    />
  )
}

function ModelFailedProcessing({ className, time, actor }) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={<ThangsPicture />}
      content={
        <div>
          <div className={c.Notification_ActorName}>Thangs</div>
          <span className={c.Notification_Time}>{time}</span>
          <div className={c.Notification_Text}>
            We were unable to process your model. Please try again.
          </div>
        </div>
      }
      right={
        <Link to={`/model/${actor.id}`}>
          <Card className={c.Notification_TargetPicture}>
            <ModelThumbnail
              className={c.Notification_Thumbnail}
              thumbnailUrl={actor.thumbnailUrl}
              name={actor.name}
            />
          </Card>
        </Link>
      }
    />
  )
}

function UserCommentedOnModel({ className, time, actor, target, actionObject, verb }) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={
        <ActorPicture name={actor.fullName} id={actor.id} img={actor.profile.avatarUrl} />
      }
      content={
        <div>
          <div className={c.Notification_ActorName}>{actor.fullName}</div>

          <div className={c.Notification_TruncateOverflow}>
            <span className={c.Notification_Verb}>{verb}</span>
            <span>on</span>
            <span className={c.Notification_TargetName}>{target.name}</span>
          </div>
          <span className={c.Notification_Time}>{time}</span>
          <div className={c.Notification_Text}>
            <div className={c.Notification_TruncateOverflow}>{actionObject.body}</div>
          </div>
        </div>
      }
      right={
        <Link to={`/model/${target.id}`}>
          <Card className={c.Notification_TargetPicture}>
            <ModelThumbnail
              className={c.Notification_Thumbnail}
              thumbnailUrl={target.thumbnailUrl}
              name={target.name}
            />
          </Card>
        </Link>
      }
    />
  )
}

function UserUploadedModel({ className, time, actor, verb, _target, actionObject }) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={
        <ActorPicture name={actor.fullName} id={actor.id} img={actor.profile.avatarUrl} />
      }
      content={
        <div>
          <div className={c.Notification_ActorName}>{actor.fullName}</div>

          <div>
            <span className={c.Notification_Verb}>{verb}</span>
            <span className={c.Notification_TargetName}>{actionObject.name}</span>
          </div>
          <span className={c.Notification_Time}>{time}</span>
        </div>
      }
      right={
        <Link to={`/model/${actionObject.id}`}>
          <Card className={c.Notification_TargetPicture}>
            <ModelThumbnail
              className={c.Notification_Thumbnail}
              thumbnailUrl={actionObject.thumbnailUrl}
              name={actionObject.name}
            />
          </Card>
        </Link>
      }
    />
  )
}

function UserLikedModel({ className, time, actor, verb, target, _actionObject }) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={
        <ActorPicture name={actor.fullName} id={actor.id} img={actor.profile.avatarUrl} />
      }
      content={
        <div>
          <div className={c.Notification_ActorName}>{actor.fullName}</div>

          <div>
            <span className={c.Notification_Verb}>{verb}</span>
            <span className={c.Notification_TargetName}>{target.name}</span>
          </div>
          <span className={c.Notification_Time}>{time}</span>
        </div>
      }
      right={
        <Link to={`/model/${target.id}`}>
          <Card className={c.Notification_TargetPicture}>
            <ModelThumbnail
              className={c.Notification_Thumbnail}
              thumbnailUrl={target.thumbnailUrl}
              name={target.name}
            />
          </Card>
        </Link>
      }
    />
  )
}

function UserStartedFollowingUser({
  className,
  time,
  actor,
  verb,
  _target,
  _actionObject,
}) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={
        <ActorPicture name={actor.fullName} id={actor.id} img={actor.profile.avatarUrl} />
      }
      content={
        <div>
          <div className={c.Notification_ActorName}>{actor.fullName}</div>

          <div>
            <span className={c.Notification_Verb}>{verb}</span>
            <span className={c.Notification_TargetName}>you</span>
          </div>
          <span className={c.Notification_Time}>{time}</span>
        </div>
      }
    />
  )
}

function UserGrantedUserAccessToFolder({
  className,
  time,
  actor,
  _verb,
  target,
  _actionObject,
}) {
  const c = useStyles()
  return (
    <Body
      className={className}
      left={
        <ActorPicture name={actor.fullName} id={actor.id} img={actor.profile.avatarUrl} />
      }
      content={
        <div>
          <div className={c.Notification_ActorName}>{actor.fullName}</div>

          <div className={c.Notification_TruncateOverflow}>
            <span className={c.Notification_Verb}>Granted you access</span>
            <span className={c.Notification_TargetName}>
              to a folder <Link to={`/folder/${target.id}`}>{target.name}</Link>
            </span>
          </div>
          <span className={c.Notification_Time}>{time}</span>
        </div>
      }
    />
  )
}

export function Notification({
  timestamp,
  actor,
  verb,
  target,
  notificationType,
  actionObject,
  className,
}) {
  const time = formatDate(timestamp)

  if (isModelFailedProcessing(notificationType)) {
    return (
      <ModelFailedProcessing
        className={className}
        time={time}
        actor={actor}
        verb={verb}
      />
    )
  } else if (isModelCompletedProcessing(notificationType)) {
    return (
      <ModelCompletedProcessing
        className={className}
        time={time}
        actor={actor}
        verb={verb}
      />
    )
  } else if (isUserCommentedOnModel(notificationType)) {
    return (
      <UserCommentedOnModel
        className={className}
        time={time}
        actor={actor}
        target={target}
        actionObject={actionObject}
        verb={verb}
      />
    )
  } else if (isUserUploadedModel(notificationType)) {
    return (
      <UserUploadedModel
        className={className}
        time={time}
        actor={actor}
        target={target}
        actionObject={actionObject}
        verb={verb}
      />
    )
  } else if (isUserStartedFollowingUser(notificationType)) {
    return (
      <UserStartedFollowingUser
        className={className}
        time={time}
        actor={actor}
        target={target}
        actionObject={actionObject}
        verb={verb}
      />
    )
  } else if (isUserGrantedUserAccessToFolder(notificationType)) {
    return (
      <UserGrantedUserAccessToFolder
        className={className}
        time={time}
        actor={actor}
        target={target}
        actionObject={actionObject}
        verb={verb}
      />
    )
  } else {
    return (
      <UserLikedModel
        className={className}
        time={time}
        actor={actor}
        target={target}
        verb={verb}
      />
    )
  }
}
