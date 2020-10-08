import React from 'react'
import { ProfilePicture } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Contributors: {
      display: 'flex',
    },
    Contributors_Avatar: {
      backgroundColor: theme.colors.white[400],
      borderRadius: '100%',
      position: 'relative',
      '&:not(:first-child)': {
        marginLeft: '-.5rem',
      },
      '& span': {
        fontWeight: 500,
        fontSize: '.75rem',
        lineHeight: '1rem',
        fontFamily: 'Montserrat',
        background: theme.colors.purple[900],
        borderRadius: '100%',
        border: `1px solid ${theme.colors.white[400]}`,

        '& span': {
          color: theme.colors.white[400],
          border: 'none',
        },
      },
    },
  }
})

const Contributors = ({ fileId, users = [] }) => {
  const c = useStyles({})
  return (
    <div className={c.Contributors}>
      {users.map((user, index) => {
        if (!user.profile || !user.profile.avatarUrl) return null
        if (index === 2 && users.length > 3)
          return (
            <div key={`${fileId}_${user.id}_${index}`} className={c.Contributors_Avatar}>
              <ProfilePicture size='1.875rem' name={`+ ${users.length - 2}`} bordered />
            </div>
          )
        if (index > 2) return null
        return (
          <div key={`${fileId}_${user.id}_${index}`} className={c.Contributors_Avatar}>
            <ProfilePicture
              size='1.875rem'
              name={user.fullName}
              userName={user.username}
              src={user.profile.avatarUrl}
              bordered
            />
          </div>
        )
      })}
    </div>
  )
}

export default Contributors
