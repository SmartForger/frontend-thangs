import React from 'react'
import { Link } from 'react-router-dom'
import { ProfilePicture } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelTitle_: {},
    ModelTitle_Container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ModelTitle_Content: {
      flexDirection: 'column',
    },
    ModelTitle_OwnerProfilePicture: {
      marginRight: '1rem',
    },
    ModelTitle_Text: {
      ...theme.mixins.text.modelTitleText,
      marginBottom: '.25rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    ModelTitle_ProfileAuthor: {
      display: 'flex',
    },
    ModelTitle_ProfileLink: {
      ...theme.mixins.text.linkText,
      display: 'block',
      textDecoration: 'none',
      marginLeft: '.25rem',
      color: theme.colors.gold[500],
      fontWeight: 600,
    },
  }
})

const ModelTitle = ({ model, className }) => {
  const c = useStyles()
  const user = model && model.owner
  return (
    <div className={classnames(className, c.ModelTitle_Container)}>
      {user && (
        <Link className={c.ModelTitle_ProfileLink} to={`/profile/${user.id}`}>
          <ProfilePicture
            className={c.ModelTitle_OwnerProfilePicture}
            size='2.5rem'
            name={user.fullName}
            src={user.profile.avatarUrl}
          />
        </Link>
      )}
      <div className={c.ModelTitle_Content}>
        <div className={c.ModelTitle_Text}>{model.name}</div>
        {user && (
          <span className={c.ModelTitle_ProfileAuthor}>
            by
            <Link className={c.ModelTitle_ProfileLink} to={`/profile/${user.id}`}>
              {user.fullName}
            </Link>
          </span>
        )}
      </div>
    </div>
  )
}

export default ModelTitle
