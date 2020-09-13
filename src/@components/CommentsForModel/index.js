import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import { Markdown, Spinner, UserInline } from '@components'
import NewModelCommentForm from './NewModelCommentForm'
import VersionComment from './VersionComment'
import { createUseStyles } from '@style'
import { useServices } from '@hooks'
import classnames from 'classnames'

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
  }
})

const getParsedBody = str => {
  try {
    const strQuotesReplaces = str.replace(/'/g, '"')
    return JSON.parse(strQuotesReplaces)
  } catch (e) {
    return str
  }
}

const renderTypedComment = ({ comment, key }) => {
  const parsedBody = getParsedBody(comment.body)
  if (typeof parsedBody === 'object') {
    return <VersionComment key={key} comment={{ ...comment, body: parsedBody }} />
  } else {
    return <Comment key={key} comment={comment} />
  }
}

const Comment = ({ comment }) => {
  const c = useStyles()
  const { owner, body, created } = comment
  const time = formatDistanceStrict(new Date(created), new Date())

  return (
    <li className={c.CommentsForModel_Comment}>
      <Link to={`/profile/${owner.id}`}>
        <UserInline
          className={c.CommentsForModel_UserInline}
          user={{ profile: owner }}
          size={'1.875rem'}
        />
      </Link>
      <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
      <span className={c.CommentsForModel_timestamp}>{`${time} ago`}</span>
    </li>
  )
}

const CommentsForModel = ({ model, className }) => {
  const c = useStyles()
  const { useFetchPerMount } = useServices()
  const {
    atom: { isLoading: loading, isLoaded: loaded, isError: error, data: comments },
  } = useFetchPerMount(model.id, 'model-comments')

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
      <NewModelCommentForm modelId={model.id} />
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) => renderTypedComment({ comment, key: i }))}
      </ul>
    </div>
  )
}

export default CommentsForModel
