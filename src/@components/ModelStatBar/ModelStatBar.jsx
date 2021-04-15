import React from 'react'
import { ContainerRow, FormError, Spacer, Spinner } from '@components'
import UserIcon from '@svg/UserIcon'
import VersionControlIcon from '@svg/VersionControlIcon'
import HeartIcon from '@svg/HeartIcon'

import MetaInfo from './MetaInfo'

const ModelStatBar = ({ modelData = {}, history = [], isLoading, isError, error }) => {
  if (isLoading) return <Spinner />
  if (isError) {
    return (
      <>
        <FormError message={error} />
        <Spacer size='1rem' />
      </>
    )
  }

  return (
    <ContainerRow>
      <MetaInfo
        icon={<UserIcon />}
        label='Collaborator'
        value={modelData.collaborators ? modelData.collaborators.length + 1 : 1}
        iconColor='#ECEBFC'
      />
      <Spacer size='1rem' />
      <MetaInfo
        icon={<VersionControlIcon color='#13BD98' />}
        label='Versions'
        value={history.length}
        iconColor='#DCF7F1'
      />
      <Spacer size='1rem' />
      <MetaInfo
        icon={<HeartIcon filled />}
        label='Likes'
        value={modelData.likesCount}
        iconColor='rgba(244, 117, 117, 0.2)'
      />
    </ContainerRow>
  )
}

ModelStatBar.displayName = 'ModelStatBar'

export default ModelStatBar
