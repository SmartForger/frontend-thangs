import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import * as GraphqlService from '@services/graphql-service'
import { Markdown } from '@components'
import { Spinner } from '@components/Spinner'
import { ProfilePicture } from '@components/ProfilePicture'
import NewModelCommentForm from './NewModelCommentForm'
import { createUseStyles } from '@style'
import VersionPicture from '@components/VersionPicture'

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
    CommentsForModel_ProfilePicture: {
      marginRight: '1rem',
    },
    CommentsForModel_TimeAgo: {
      ...theme.mixins.text.commentPostedText,
    },
    CommentsForModel_FlexGrow: {
      flexGrow: 1,
    },
    CommentsForModel_Name: {
      ...theme.mixins.text.commentUsername,
      marginBottom: '1rem',
    },
    CommentsForModel_Header: {
      ...theme.mixins.text.subheaderText,
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const Comment = ({ comment }) => {
  const c = useStyles()
  const { owner, body, created } = comment
  const time = formatDistance(new Date(created), new Date())

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
        <div>
          <div>
            <div className={c.CommentsForModel_Name}>{owner.fullName}</div>
            <div className={c.CommentsForModel_TimeAgo}>Posted {time} ago</div>
            <Markdown>{body}</Markdown>
          </div>
        </div>
      </div>
    </li>
  )
}

const VersionComment = ({ comment }) => {
  const c = useStyles()
  const {
    owner,
    body: { nextVersionId, name = '' },
    created,
  } = comment
  const time = formatDistance(new Date(created), new Date())

  if (!nextVersionId) {
    return <></>
  }

  return (
    <li className={c.CommentsForModel}>
      <Link to={`/model/${nextVersionId}`}>
        <VersionPicture />
      </Link>
      <div className={c.CommentsForModel_FlexGrow}>
        <div>
          <div>
            <Markdown>{`${name} uploaded`}</Markdown>
            <div className={c.CommentsForModel_TimeAgo}>
              {owner.fullName} / {time}
            </div>
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

  return (
    <div className={className}>
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) => renderTypedComment({ comment, key: i }))}
      </ul>
      <NewModelCommentForm modelId={model.id} />
    </div>
  )
}

export default CommentsForModel
