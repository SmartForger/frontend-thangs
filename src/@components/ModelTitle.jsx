import React from 'react'
import { Link } from 'react-router-dom'
import { ProfilePicture } from '@components/ProfilePicture'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as GraphqlService from '@services/graphql-service'
import { Spinner } from './Spinner'

const graphqlService = GraphqlService.getInstance()

const useStyles = createUseStyles(theme => {
  return {
    ModelTitle_: {},
    ModelTitle_Container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: '.5rem 0 2rem',
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
  let { loading, error, user } = graphqlService.useUserById(model.ownerId)

  if (loading) {
    return <Spinner />
  } else if (error || !user) {
    return <div>Error loading user</div>
  }
  return (
    <div className={classnames(className, c.ModelTitle_Container)}>
      {user && (
        <Link className={c.ModelTitle_ProfileLink} to={`/profile/${model.ownerId}`}>
          <ProfilePicture
            className={c.ModelTitle_OwnerProfilePicture}
            size='48px'
            name={user.fullName}
            src={user.profile.avatarUrl}
          />
        </Link>
      )}
      <div className={c.ModelTitle_Content}>
        <div className={c.ModelTitle_Text}>{model.name}</div>
        {user && (
          <Link className={c.ModelTitle_ProfileLink} to={`/profile/${model.ownerId}`}>
            {user.fullName}
          </Link>
        )}
      </div>
    </div>
  )
}
