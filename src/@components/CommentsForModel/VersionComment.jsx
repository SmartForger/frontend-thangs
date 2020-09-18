import React from 'react'
import { formatDistanceStrict } from 'date-fns'
import { Markdown } from '@components'
import { ReactComponent as VersionIcon } from '@svg/icon-version.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    VersionComment: {
      display: 'flex',
      flexDirection: 'column',
    },
    VersionComment_Wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    VersionComment_Info: {},
    VersionComment_Owner: {
      ...theme.text.linkText,
      fontSize: '.75rem',
    },
    VersionComment_Date: {
      color: '#88888b',
      margin: '1rem 2.375rem 0',
      fontSize: '.75rem',
      fontWeight: 600,
      lineHeight: '.75rem',
    },
    UserInline: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    UserInline_Info: {
      marginLeft: '.5rem',
      flexGrow: 1,
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.black[500],
    },
    CommentsForModel_CommentBody: {
      margin: '0.25rem 2.375rem 0',
    },
  }
})

const VersionComment = ({ comment }) => {
  const c = useStyles()
  const {
    owner,
    body: { nextVersionId },
    created,
  } = comment
  const time = formatDistanceStrict(new Date(created), new Date())

  if (!nextVersionId) {
    return <></>
  }

  const body = `<strong>New Version Uploaded</strong> [#${nextVersionId}](/model/${nextVersionId})`

  return (
    <li className={c.VersionComment}>
      <div>
        <div className={c.UserInline}>
          <VersionIcon width={'1.75rem'} height={'1.75rem'} />
          <span className={c.UserInline_Info}>
            <div>{owner.username}</div>
          </span>
        </div>
      </div>
      <Markdown className={c.CommentsForModel_CommentBody}>{body}</Markdown>
      <span className={c.VersionComment_Date}>{` ${time} ago`}</span>
    </li>
  )
}

export default VersionComment
