import React from 'react'
import { ContainerRow, ProfilePicture, CollaboratorActionMenu } from '@components'
import { Body, createUseStyles, Spacer, Metadata } from '@physna/voxel-ui'

const useStyles = createUseStyles(theme => ({
  Collaborator_Info: {
    flex: 1,
  },
}))

const Collaborator = ({ user, relation }) => {
  const c = useStyles()
  const fullName = (user.fullName || `${user.firstName} ${user.lastName}`).trim()

  return (
    <ContainerRow alignItems='center'>
      <ProfilePicture
        size='1.875rem'
        name={fullName}
        userName={user.username}
        src={user.profile && user.profile.avatarUrl}
      />
      <Spacer size='1rem' />
      <div className={c.Collaborator_Info}>
        <Body>{fullName || user.username}</Body>
        <Spacer size='.25rem' />
        <Metadata type={1}>{relation}</Metadata>
      </div>
      {relation !== 'Owner' && <CollaboratorActionMenu onChange={console.log} />}
    </ContainerRow>
  )
}

export default Collaborator
