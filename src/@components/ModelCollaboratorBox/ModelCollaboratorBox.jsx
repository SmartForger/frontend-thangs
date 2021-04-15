import React from 'react'
import { FormError, Spinner, ContainerRow, ContainerColumn, Pill } from '@components'
import { createUseStyles, Spacer, Title } from '@physna/voxel-ui'
import { useOverlay } from '@hooks'

import Collaborator from './Collaborator'

const useStyles = createUseStyles(theme => ({
  ModelCollaboratorBox: {
    borderRadius: '.5rem',
    border: `1px solid ${theme.colors.white[900]}`,
  },
  ModelCollaboratorBox_Title: {
    color: theme.colors.grey[300],
  },
}))

const ModelCollaboratorBox = ({ modelData = {}, isLoading, isError, error }) => {
  const c = useStyles()
  const { setOverlay } = useOverlay()

  const handleInvite = () => {
    if (modelData.folderId) {
      setOverlay({
        isOpen: true,
        template: 'inviteUsers',
        data: {
          folderId: modelData.folderId,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    }
  }

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
    <ContainerColumn className={c.ModelCollaboratorBox}>
      <Spacer size='1.5rem' />
      <ContainerRow>
        <Spacer size='1.5rem' />
        <div>
          <Title className={c.ModelCollaboratorBox_Title} headerLevel='h4'>
            COLLABORATORS
          </Title>
          <Spacer size='1.5rem' />
          {modelData.owner && <Collaborator user={modelData.owner} relation='Owner' />}
          <Spacer size='1.5rem' />
          <ContainerRow>
            <ContainerColumn>
              <Pill tertiary onClick={handleInvite}>
                Invite collaborators
              </Pill>
            </ContainerColumn>
          </ContainerRow>
        </div>
        <Spacer size='1.5rem' />
      </ContainerRow>
      <Spacer size='1.5rem' />
    </ContainerColumn>
  )
}

ModelCollaboratorBox.displayName = 'ModelCollaboratorBox'

export default ModelCollaboratorBox
