import React from 'react'
import { FormError, Spinner, ContainerRow, ContainerColumn, Pill } from '@components'
import { createUseStyles, Spacer, Metadata } from '@physna/voxel-ui'

import Collaborator from './Collaborator'

const useStyles = createUseStyles(theme => ({
  ModelInfoBox_Collaborators: {
    borderRadius: '.5rem',
    border: `1px solid ${theme.colors.white[900]}`,
    padding: '1.5rem',
  },
}))

const ModelInfoBox = ({ modelData = {}, isLoading, isError, error }) => {
  const c = useStyles()

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
    <div className={c.ModelInfoBox_Collaborators}>
      <Metadata type={0}>COLLABORATORS</Metadata>
      <Spacer size='1.5rem' />
      <Collaborator user={modelData.owner} relation='Owner' />
      <Spacer size='1.5rem' />
      <ContainerRow>
        <ContainerColumn>
          <Pill tertiary>Invite collaborators</Pill>
        </ContainerColumn>
      </ContainerRow>
    </div>
  )
}

ModelInfoBox.displayName = 'ModelInfoBox'

export default ModelInfoBox
