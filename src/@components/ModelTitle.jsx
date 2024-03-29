import React from 'react'
import { Link } from 'react-router-dom'
import { ProfilePicture, Spacer } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'

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
      ...theme.text.modelTitleText,
      marginBottom: '.25rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    ModelTitle_ProfileAuthor: {
      display: 'flex',
    },
    ModelTitle_ProfileLink: {
      ...theme.text.linkText,
      display: 'block',
      textDecoration: 'underline',
      color: theme.colors.black[500],
      fontWeight: '500',
      fontSize: '.875rem',
    },
  }
})

const ModelTitle = ({ model, className, closeOverlay }) => {
  const c = useStyles()
  const user = model && model.owner
  return (
    <div className={classnames(className, c.ModelTitle_Container)}>
      {user && (
        <Link
          onClick={closeOverlay}
          className={c.ModelTitle_ProfileLink}
          to={{
            pathname: `/${user.username}`,
            state: { fromModel: true },
          }}
        >
          <ProfilePicture
            className={c.ModelTitle_OwnerProfilePicture}
            size='2.5rem'
            name={user.fullName}
            userName={user.username}
            src={user.profile && user.profile.avatarUrl}
          />
        </Link>
      )}
      <div className={c.ModelTitle_Content}>
        <h1 className={c.ModelTitle_Text}>{model.name}</h1>
        {user && (
          <span className={c.ModelTitle_ProfileAuthor}>
            by
            <Spacer size={'.25rem'} />
            <Link
              onClick={closeOverlay}
              className={c.ModelTitle_ProfileLink}
              to={{
                pathname: `/${user.username}`,
                state: { fromModel: true },
              }}
            >
              <h1 className={c.ModelTitle_ProfileLink}>{user.username}</h1>
            </Link>
          </span>
        )}
      </div>
    </div>
  )
}

export default ModelTitle
