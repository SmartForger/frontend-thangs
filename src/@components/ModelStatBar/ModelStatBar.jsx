import React from 'react'
import {
  ContainerColumn,
  ContainerRow,
  FormError,
  Pill,
  Spacer,
  Spinner,
} from '@components'
import { Body, createUseStyles, Metadata } from '@physna/voxel-ui'
import UserIcon from '@svg/UserIcon'
import VersionControlIcon from '@svg/VersionControlIcon'
import HeartIcon from '@svg/HeartIcon'
import { useOverlay } from '@hooks'

import MetaInfo from './MetaInfo'

const useStyles = createUseStyles(theme => ({
  ModelStatBar_ModelStats: {
    borderRadius: '.5rem',
    border: `1px solid ${theme.colors.white[900]}`,
    padding: '1.5rem',
  },
  ModelStatBar_EditModel: {
    display: 'inline-block',
  },
}))

const ModelStatBar = ({ modelData = {}, isLoading, isError, error }) => {
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
    <React.Fragment>
      <ContainerRow>
        <MetaInfo
          icon={<UserIcon />}
          label='Collaborator'
          value='3'
          iconColor='#ECEBFC'
        />
        <Spacer size='1rem' />
        <MetaInfo
          icon={<VersionControlIcon color='#13BD98' />}
          label='Versions'
          value='4'
          iconColor='#DCF7F1'
        />
        <Spacer size='1rem' />
        <MetaInfo
          icon={<HeartIcon filled />}
          label='Likes'
          value='1295'
          iconColor='rgba(244, 117, 117, 0.2)'
        />
      </ContainerRow>
      <Spacer size={'2rem'} />
      <div className={c.ModelStatBar_ModelStats}>
        <Metadata type={0}>MODEL INFORMATION</Metadata>
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
      <Spacer size={'1.5rem'} />
    </React.Fragment>
  )
}

ModelStatBar.displayName = 'ModelStatBar'

export default ModelStatBar
