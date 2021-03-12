import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import { CommentsActionMenu, Markdown, Spinner, UserInline } from '@components'
import NewModelCommentForm from './NewModelCommentForm'
import VersionComment from './VersionComment'
import { createUseStyles } from '@style'
import { useOverlay, useServices } from '@hooks'
import classnames from 'classnames'
import { track } from '../../@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    CommentsForModel: {
      ...theme.text.formCalloutText,
      marginTop: '0.5rem',
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    CommentsForModel_Comment: {
      display: 'flex',
      flexDirection: 'column',
    },
    CommentsForModel_List: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      '& > *': {
        marginBottom: '2rem',
      },
    },
    CommentsForModel_CommentBody: {
      color: theme.colors.black[500],
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1.5rem',
      margin: '0.25rem 3.5rem 0',
    },
    CommentsForModel_timestamp: {
      ...theme.text.metadataBase,
      alignItems: 'center',
      margin: 0,
      padding: 0,
      color: theme.colors.grey[300],
      fontSize: '.75rem',
      lineHeight: '1rem',
      display: 'inline-block',
      textAlign: 'center',
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
    CommentsForModel_MenuButton: {
      padding: '0 .5rem',
      position: 'relative',
      cursor: 'pointer',

      '& > svg': {
        padding: '.25rem',
        borderRadius: '.25rem',
        border: '1px solid transparent',

        '&:hover': {
          border: `1px solid ${theme.colors.grey[300]}`,
        },
      },
    },
    CommentsForModel_CommentMenu: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: '1',
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
  }
})

const noop = () => null
const getParsedBody = str => {
  try {
    const strQuotesReplaces = str.replace(/'/g, '"')
    return JSON.parse(strQuotesReplaces)
  } catch (e) {
    return str
  }
}

const renderTypedComment = ({ modelId, comment, key, currentUser, onChange }) => {
  const parsedBody = getParsedBody(comment.body)
  if (typeof parsedBody === 'object') {
    return <VersionComment key={key} comment={{ ...comment, body: parsedBody }} />
  } else {
    return (
      <Comment
        key={key}
        modelId={modelId}
        onChange={onChange}
        comment={comment}
        currentUser={currentUser}
      />
    )
  }
}

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
      <div className={c.CommentsForModel_CommentHeader}>
        <div className={c.CommentsForModel_CommentHeaderRow}>
          <Link
            to={{
              pathname: `/${owner.username}`,
              state: { fromModel: true },
            }}
          >
            <UserInline
              className={c.CommentsForModel_UserInline}
              user={{ ...owner }}
              size={'2.5rem'}
            />
          </Link>
          <span className={c.CommentsForModel_timestamp}>{`${time} ago`}</span>
        </div>
        {canEdit && <CommentsActionMenu onChange={onChange} />}
      </div>
      <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
    </li>
  )
}

const AuthCommentsForModel = ({ c, className, modelId, currentUser }) => {
  const { useFetchPerMount } = useServices()
  const {
    atom: { isLoading: loading, isLoaded: loaded, isError: error, data: comments = [] },
  } = useFetchPerMount(modelId, 'model-comments')

  if (error) {
    return <div className={className}>Error loading comments</div>
  }

  if (loading || !loaded) {
    return (
      <div className={className}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={classnames(className, c.CommentsForModel)}>
      {(comments && comments.length) || 0}{' '}
      {comments && comments.length && comments.length === 1 ? 'comment' : 'comments'}
      <NewModelCommentForm modelId={modelId} />
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) =>
          renderTypedComment({ modelId, comment, key: i, currentUser })
        )}
      </ul>
    </div>
  )
}

const UnauthCommentsForModel = ({ className, c, openSignupOverlay }) => {
  return (
    <div className={classnames(className, c.CommentsForModel)}>
      <NewModelCommentForm openSignupOverlay={openSignupOverlay} />
    </div>
  )
}

const CommentsForModel = ({
  className,
  currentUser,
  modelId,
  openSignupOverlay = noop,
}) => {
  const c = useStyles()
  if (currentUser) {
    return (
      <AuthCommentsForModel
        className={className}
        c={c}
        currentUser={currentUser}
        modelId={modelId}
      />
    )
  }
  return (
    <UnauthCommentsForModel
      className={className}
      c={c}
      openSignupOverlay={openSignupOverlay}
    />
  )
}

export default CommentsForModel
