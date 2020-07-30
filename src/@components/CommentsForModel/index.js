import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import * as GraphqlService from '@services/graphql-service'
import { Markdown } from '@components'
import { Spinner } from '@components/Spinner'
import { UserInline } from '@components/UserInline'
import NewModelCommentForm from './NewModelCommentForm'
import { ReactComponent as VersionIcon } from '@svg/icon_version.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
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
        marginBottom: '2rem'
      }
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
    CommentsForModel_CommentBody: {
      margin: '0.5rem 3rem 0',
    },
    CommentsForModel_VersionComment: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    CommentsForModel_VersionCommentInfo: {
      marginLeft: '1rem',
    },
    CommentsForModel_VersionCommentOwner: {
      ...theme.mixins.text.linkText,
      fontSize: '.75rem',
    },
    CommentsForModel_VersionCommentDate: {
      ...theme.mixins.text.footerText,
      fontSize: '.75rem',
    },
  }
})

const graphqlService = GraphqlService.getInstance()

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
          user={owner}
          size={'3rem'}
          suffix={`${time} ago`}
        />
      </Link>
      <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
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
  const time = formatDistanceStrict(new Date(created), new Date())

  if (!nextVersionId) {
    return <></>
  }

  return (
    <li className={c.CommentsForModel}>
      <div className={c.CommentsForModel_VersionComment}>
        <VersionIcon />
        <div className={c.CommentsForModel_VersionCommentInfo}>
          <div>
            {`Version of ${name} `}
            <Link to={`/model/${nextVersionId}`}>#{nextVersionId}</Link>
            {' uploaded'}
          </div>
          <div className={c.CommentsForModel_VersionCommentOwner}>
            {owner.fullName}
            <span
              className={c.CommentsForModel_VersionCommentDate}
            >{` ${time} ago`}</span>
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
      <NewModelCommentForm modelId={model.id} />
      <ul className={c.CommentsForModel_List}>
        {comments.map((comment, i) => renderTypedComment({ comment, key: i }))}
      </ul>
    </div>
  )
}

export default CommentsForModel
