import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { CommentsActionMenu, Markdown, ProfilePicture } from '@components'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    CommentsForModel_Comment: {
      display: 'flex',
      padding: '1rem',
      borderRadius: '.5rem',
      border: `1px solid ${theme.colors.white[900]}`,
    },
    CommentsForModel_CommentHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    CommentsForModel_CommentHeaderRow: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    CommentsForModel_UserInline: {
      '& > span': {
        ...theme.text.bodyBase,
        fontSize: '1rem',
        lineHeight: '1rem',
        whiteSpace: 'nowrap',
        display: 'inline',
        margin: '0 .5rem 0 1rem',
        padding: 0,
        color: theme.colors.black[500],
      },
    },
    CommentsForModel_CommentBody: {
      color: theme.colors.black[500],
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1.5rem',
      marginTop: '0.25rem',
    },
    CommentsForModel_timestamp: {
      marginLeft: '0.5rem',
    },
    CommentsForModel_ProfilePicture: {
      marginRight: '1rem',
    },
    CommentsForModel_Content: {
      flex: 1,
    },
  }
})

const Comment = ({ modelId, comment, currentUser }) => {
  const c = useStyles()
  const { setOverlay } = useOverlay()
  const { owner, body, created } = comment
  const time = formatDistanceStrict(new Date(created), new Date())
  const canEdit = currentUser.id === owner.id

  const editComment = () => {
    setOverlay({
      isOpen: true,
      template: 'editComment',
      data: {
        modelId,
        comment,
        animateIn: true,
        windowed: true,
        showViewer: false,
      },
    })
    track('Model page edit comment clicked')
  }

  const deleteComment = () => {
    setOverlay({
      isOpen: true,
      template: 'deleteComment',
      data: {
        modelId,
        comment,
        animateIn: true,
        windowed: true,
        showViewer: false,
      },
    })
    track('Model page delete comment clicked')
  }

  const onChange = useCallback(
    type => {
      if (type === 'edit') {
        editComment()
      } else if (type === 'delete') {
        deleteComment()
      }
    },
    // eslint-disable-next-line
    []
  )

  return (
    <li className={c.CommentsForModel_Comment}>
      {owner && (
        <div className={c.CommentsForModel_ProfilePicture}>
          <Link
            to={{
              pathname: `/${owner.username}`,
              state: { fromModel: true },
            }}
          >
            <ProfilePicture
              size={'2.5rem'}
              name={owner.fullName}
              userName={owner.username}
              src={(owner.profile && owner.profile.avatarUrl) || owner.avatarUrl}
            />
          </Link>
        </div>
      )}
      <div className={c.CommentsForModel_Content}>
        <div className={c.CommentsForModel_CommentHeader}>
          <div className={c.CommentsForModel_CommentHeaderRow}>
            <Title headerLevel={HeaderLevel.tertiary}>
              {owner.fullName.trim() || owner.username}
            </Title>
            <span className={c.CommentsForModel_timestamp}>{`${time} ago`}</span>
          </div>
          {canEdit && <CommentsActionMenu onChange={onChange} />}
        </div>
        <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
      </div>
    </li>
  )
}

export default Comment
