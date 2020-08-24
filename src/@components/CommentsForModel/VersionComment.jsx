import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'
import { ReactComponent as VersionIcon } from '@svg/icon_version.svg'
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
    VersionComment_Info: {
      marginLeft: '1rem',
    },
    VersionComment_Owner: {
      ...theme.mixins.text.linkText,
      fontSize: '.75rem',
    },
    VersionComment_Date: {
      ...theme.mixins.text.footerText,
      fontSize: '.75rem',
    },
  }
})

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
    <li className={c.VersionComment}>
      <div className={c.VersionComment_Wrapper}>
        <VersionIcon />
        <div className={c.VersionComment_Info}>
          <div>
            {`Version of ${name} `}
            <Link to={`/model/${nextVersionId}`}>#{nextVersionId}</Link>
            {' uploaded'}
          </div>
          <div className={c.VersionComment_Owner}>
            {owner.fullName}
            <span className={c.VersionComment_Date}>{` ${time} ago`}</span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default VersionComment
