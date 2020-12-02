import React, { useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import { Markdown, Spinner, UserInline } from '@components'
import NewModelCommentForm from './NewModelCommentForm'
import VersionComment from './VersionComment'
import { createUseStyles } from '@style'
import { useServices, useExternalClick } from '@hooks'
import classnames from 'classnames'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import CommentMenu from './CommentMenu'

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
      margin: '0.25rem 2.375rem 0',
    },
    CommentsForModel_timestamp: {
      ...theme.text.footerText,
      fontSize: '.75rem',
      margin: '1rem 2.375rem 0',
      fontWeight: 600,
      lineHeight: '.75rem',
    },
    CommentsForModel_CommentHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    CommentsForModel_MenuButton: {
      padding: '0 .5rem',
      position: 'relative',

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
      zIndex: 1,
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

const renderTypedComment = ({ modelId, comment, key }) => {
  const parsedBody = getParsedBody(comment.body)
  if (typeof parsedBody === 'object') {
    return <VersionComment key={key} comment={{ ...comment, body: parsedBody }} />
  } else {
    return <Comment key={key} modelId={modelId} comment={comment} />
  }
}

const Comment = ({ modelId, comment }) => {
  const c = useStyles()
  const { owner, body, created } = comment
  const time = formatDistanceStrict(new Date(created), new Date())
  const commentMenuRef = useRef(null)
  const [showCommentMenu, setShowCommentMenu] = useState(false)

  useExternalClick(commentMenuRef, () => setShowCommentMenu(false))

  const handleCommentMenu = useCallback(
    e => {
      e.stopPropagation()
      setShowCommentMenu(!showCommentMenu)
    },
    [showCommentMenu]
  )

  return (
    <li className={c.CommentsForModel_Comment}>
      <div className={c.CommentsForModel_CommentHeader}>
        <Link
          to={{
            pathname: `/${owner.username}`,
            state: { fromModel: true },
          }}
        >
          <UserInline
            className={c.CommentsForModel_UserInline}
            user={{ ...owner }}
            size={'1.875rem'}
          />
        </Link>
        <div
          className={c.CommentsForModel_MenuButton}
          onClick={handleCommentMenu}
          ref={commentMenuRef}
        >
          <DotStackIcon />
          {showCommentMenu && (
            <div className={c.CommentsForModel_CommentMenu}>
              <CommentMenu modelId={modelId} comment={comment} />
            </div>
          )}
        </div>
      </div>
      <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
      <span className={c.CommentsForModel_timestamp}>{`${time} ago`}</span>
    </li>
  )
}

const AuthCommentsForModel = ({ c, className, modelId }) => {
  const { useFetchPerMount } = useServices()
  const {
    atom: { isLoading: loading, isLoaded: loaded, isError: error, data: comments },
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
      {comments && comments.length}{' '}
      {comments && comments.length && comments.length === 1 ? 'comment' : 'comments'}
      <NewModelCommentForm modelId={modelId} />
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) => renderTypedComment({ modelId, comment, key: i }))}
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
