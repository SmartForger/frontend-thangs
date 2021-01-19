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
    VersionComment_timestamp: {
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
    UserInline: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    VersionComment_CommentBody: {
      color: theme.colors.black[500],
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1.5rem',
      margin: '0.25rem 3.5rem 0',
    },
    VersionComment_HeaderRow: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    VersionComment_UserInline: {
      ...theme.text.bodyBase,
      fontSize: '1rem',
      lineHeight: '.75rem',
      whiteSpace: 'nowrap',
      display: 'inline',
      margin: '0 .5rem 0 1rem',
      padding: 0,
      color: theme.colors.black[500],
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
          <VersionIcon width={'2.5rem'} height={'2.5rem'} />
          <div className={c.VersionComment_HeaderRow}>
            <span className={c.VersionComment_UserInline}>{owner.username}</span>
            <span className={c.VersionComment_timestamp}>{` ${time} ago`}</span>
          </div>
        </div>
      </div>
      <Markdown className={c.VersionComment_CommentBody}>{body}</Markdown>
    </li>
  )
}

export default VersionComment
