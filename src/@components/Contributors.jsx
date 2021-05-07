import React from 'react'
import { ProfilePicture } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  return {
    Contributors: {
      display: 'flex',
      cursor: 'pointer',
    },
    Contributors_Avatar: {
      backgroundColor: theme.colors.white[400],
      borderRadius: '100%',
      position: 'relative',
      '&:not(:first-child)': {
        marginLeft: '-.5rem',
      },
      '& span': {
        fontWeight: '500',
        fontSize: '.75rem',
        lineHeight: '1rem',
        borderRadius: '100%',

        '& span': {
          border: 'none',
        },
      },
    },
  }
})

const noop = () => null

const Contributors = ({
  fileId,
  users = [],
  displayLength = 2,
  onClick = noop,
  size = '1.875rem',
}) => {
  const c = useStyles({})
  const filteredUsers = users.filter(user => user && (user.fullName || user.username))
  let confirmedContributors = filteredUsers.filter(user => user.fullName)
  return (
    <div className={c.Contributors} onClick={onClick}>
      {filteredUsers.map((user, index) => {
        if (index === displayLength && confirmedContributors.length > displayLength + 1) {
          let undisplayedUserCount = `+ ${confirmedContributors.length - displayLength}`
          let undisplayedUserList = confirmedContributors
            .slice(displayLength)
            .map(user => user.fullName)
            .join('\n')
          return (
            <div key={`${fileId}_${user.id}_${index}`} className={c.Contributors_Avatar}>
              <ProfilePicture
                size={size}
                name={undisplayedUserCount}
                title={undisplayedUserList}
                bordered
              />
            </div>
          )
        }
        if (index > displayLength) return null
        return (
          <div key={`${fileId}_${user.id}_${index}`} className={c.Contributors_Avatar}>
            <ProfilePicture
              size={size}
              name={user.fullName}
              userName={user.username}
              src={user.profile && user.profile.avatarUrl}
              bordered
            />
          </div>
        )
      })}
    </div>
  )
}

export default Contributors
