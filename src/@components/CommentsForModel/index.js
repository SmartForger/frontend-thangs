import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import * as GraphqlService from '@services/graphql-service'
import { Markdown } from '@components'
import { Spinner } from '@components/Spinner'
import { ProfilePicture } from '@components/ProfilePicture'
import NewModelCommentForm from './NewModelCommentForm'
import { subheaderText, commentPostedText, commentUsername } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    CommentsForModel: {
      display: 'flex',
      marginTop: '2.5rem',
    },
    CommentsForModel_List: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    },
    CommentsForModel_Box: {
      backgroundColor: theme.colors.grey[500],
    },
    CommentsForModel_ProfilePicture: {
      marginRight: '1rem',
    },
    CommentsForModel_TimeAgo: {
      ...commentPostedText,
    },
    CommentsForModel_Body: {
      marginBottom: '.25rem',
      marginTop: '1rem',
    },
    CommentsForModel_FlexGrow: {
      flexGrow: 1,
    },
    CommentsForModel_Name: {
      ...commentUsername,
      marginBottom: '1rem',
    },
    CommentsForModel_Header: {
      ...subheaderText,
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const Comment = ({ comment }) => {
  const c = useStyles()
  const time = formatDistance(new Date(comment.created), new Date())
  const { owner, body } = comment
  return (
    <li className={c.CommentsForModel}>
      <Link to={`/profile/${owner.id}`}>
        <ProfilePicture
          className={c.CommentsForModel_ProfilePicture}
          size='48px'
          name={owner.fullName}
          src={owner.profile.avatarUrl}
        />
      </Link>
      <div className={c.CommentsForModel_FlexGrow}>
        <div className={c.CommentsForModel_Box}>
          <div className={c.CommentsForModel_Body}>
            <div className={c.CommentsForModel_Name}>{owner.fullName}</div>
            <div className={c.CommentsForModel_TimeAgo}>Posted {time} ago</div>
            <Markdown>{body}</Markdown>
          </div>
        </div>
      </div>
    </li>
  )
}

const CommentsForModel = ({ model, className }) => {
  const c = useStyles()
  const { loading, error, comments } = graphqlService.useAllModelComments(model.id)

  if (error) {
    return <div className={className}>Error loading comments</div>
  }

  if (loading) {
    return (
      <div className={className}>
        <Spinner />
      </div>
    )
  }

  const commentsHeaderText =
    comments.length > 1 || comments.length === 0 ? 'Comments' : 'Comment'
  return (
    <div className={className}>
      <h2 className={c.CommentsForModel_Header}>
        {comments.length} {commentsHeaderText}
      </h2>
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) => (
          <Comment key={i} comment={comment} />
        ))}
      </ul>
      <NewModelCommentForm modelId={model.id} />
    </div>
  )
}

export default CommentsForModel
