import React from 'react'
import { Body, createUseStyles, Spacer, Metadata, Title } from '@physna/voxel-ui'
import { ContainerColumn, ContainerRow, FormError, Pill, Spinner } from '@components'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => ({
  ModelInfoBox: {
    borderRadius: '.5rem',
    border: `1px solid ${theme.colors.white[900]}`,
  },
  ModelInfoBox_Title: {
    color: theme.colors.grey[300],
  },
}))

const ModelInfoBox = ({ modelData = {}, isLoading, isError, error }) => {
  const c = useStyles()
  const { setOverlay } = useOverlay()

  const handleEditModel = () => {
    setOverlay({
      isOpen: true,
      template: 'editModel',
      data: {
        model: modelData,
        type: 'model',
        animateIn: true,
        windowed: true,
      },
    })
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
    <ContainerColumn className={c.ModelInfoBox}>
      <Spacer size='1.5rem' />
      <ContainerRow>
        <Spacer size='1.5rem' />
        <div>
          <Title className={c.ModelInfoBox_Title} headerLevel='h4'>
            MODEL INFORMATION
          </Title>
          <Spacer size='1.5rem' />
          {modelData.name && (
            <>
              <Metadata type={1}>MODEL NAME</Metadata>
              <Spacer size='.25rem' />
              <Body>{modelData.name}</Body>
              <Spacer size='1.5rem' />
            </>
          )}
          {modelData.description && (
            <>
              <Metadata type={1}>DESCRIPTION</Metadata>
              <Spacer size='.25rem' />
              <Body>{modelData.description}</Body>
              <Spacer size='1.5rem' />
            </>
          )}
          {modelData.material && (
            <>
              <Metadata type={1}>MATERIAL</Metadata>
              <Spacer size='.25rem' />
              <Body>{modelData.material}</Body>
              <Spacer size='1.5rem' />
            </>
          )}
          {(modelData.height || modelData.weight) && (
            <>
              <ContainerRow>
                {modelData.height && (
                  <>
                    <ContainerColumn>
                      <Metadata type={1}>HEIGHT</Metadata>
                      <Spacer size='.25rem' />
                      <Body>{modelData.height}</Body>
                    </ContainerColumn>
                    <Spacer size='2rem' />
                  </>
                )}
                {modelData.weight && (
                  <ContainerColumn>
                    <Metadata type={1}>WEIGHT</Metadata>
                    <Spacer size='.25rem' />
                    <Body>{modelData.weight}</Body>
                  </ContainerColumn>
                )}
              </ContainerRow>
              <Spacer size='1.5rem' />
            </>
          )}
          {modelData.category && (
            <>
              <Metadata type={1}>CATEGORY</Metadata>
              <Spacer size='.25rem' />
              <Body>Character</Body>
              <Spacer size='1.5rem' />
            </>
          )}
          <Metadata type={1}>PRIVACY</Metadata>
          <Spacer size='.25rem' />
          <Body>
            {modelData.isPublic ? 'This model is public' : 'This model is private'}
          </Body>
          <Spacer size='1.5rem' />
          <ContainerRow>
            <ContainerColumn>
              <Pill tertiary onClick={handleEditModel}>
                Edit model
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

ModelInfoBox.displayName = 'ModelInfoBox'

export default ModelInfoBox
