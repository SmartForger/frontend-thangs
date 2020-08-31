import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import { Markdown, Spinner, UserInline } from '@components'
import NewModelCommentForm from './NewModelCommentForm'
import VersionComment from './VersionComment'
import { createUseStyles } from '@style'
import { useServices } from '@hooks'

const useStyles = createUseStyles(_theme => {
  return {
    CommentsForModel: {
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
      margin: '0.5rem 3rem 0',
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
    <li className={c.CommentsForModel}>
      <Link to={`/profile/${owner.id}`}>
        <UserInline
          className={c.CommentsForModel_UserInline}
          user={{ profile: owner }}
          size={'3rem'}
          suffix={`${time} ago`}
        />
      </Link>
      <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
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
    <div className={className}>
      <NewModelCommentForm modelId={model.id} />
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) => renderTypedComment({ comment, key: i }))}
      </ul>
    </div>
  )
}

export default CommentsForModel
