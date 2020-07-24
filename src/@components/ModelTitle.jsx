import React from 'react'
import { Link } from 'react-router-dom'
import { ProfilePicture } from '@components/ProfilePicture'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelTitle_: {},
    ModelTitle_Container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: '.5rem 0',
    },
    ModelTitle_Content: {
      flexDirection: 'column',
    },
    ModelTitle_OwnerProfilePicture: {
      marginRight: '1rem',
    },
    ModelTitle_Text: {
      ...theme.mixins.text.modelTitleText,
      marginBottom: '.5rem',
    },
    ModelTitle_ProfileLink: {
      ...theme.mixins.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
  }
})

export const ModelTitle = ({ model, className }) => {
  const c = useStyles()
  return (
    <div className={classnames(className, c.ModelTitle_Container)}>
      {model.owner && (
        <Link className={c.ModelTitle_ProfileLink} to={`/profile/${model.owner.id}`}>
          <ProfilePicture
            className={c.ModelTitle_OwnerProfilePicture}
            size='48px'
            name={model.owner.fullName}
            src={model.owner.profile.avatarUrl}
          />
        </Link>
      )}
      <div className={c.ModelTitle_Content}>
        <div className={c.ModelTitle_Text}>{model.name}</div>
        {model.owner && (
          <Link className={c.ModelTitle_ProfileLink} to={`/profile/${model.owner.id}`}>
            {model.owner.fullName}
          </Link>
        )}
      </div>
    </div>
  )
}
