import React, { useEffect, useCallback } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { useStoreon } from 'storeon/react'
import { Button, Spacer, Spinner } from '@components'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'
import { useOverlay } from '@hooks'
import { ReactComponent as PhotoIcon } from '@svg/icon-photo.svg'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(() => {
  return {
    ModelPrints: {
      display: 'flex',
      flexDirection: 'column',
    },
    ModelPrints_ImagesWrapper: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(5rem, 6rem))',
    },
    ModelPrints_Image: {
      width: '6.25rem',
      height: '6.25rem',
      borderRadius: '0.75rem',
      objectFit: 'cover',
      cursor: 'pointer',
    },
  }
})

const noop = () => null

const AddPrintPhotoLink = ({ modelId, isAuthedUser, openSignupOverlay = noop }) => {
  const { setOverlay } = useOverlay()

  const handleClick = useCallback(() => {
    if (isAuthedUser) {
      setOverlay({
        isOpen: true,
        template: 'attachmentUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          modelId,
        },
      })
    } else {
      openSignupOverlay('Join to Like, Follow, Share.', 'Version Upload')
      track('SignUp Prompt Overlay', { source: 'Version Upload' })
    }
  }, [isAuthedUser, modelId, openSignupOverlay, setOverlay])

  return (
    <Button secondary onClick={handleClick}>
      <div>
        <PhotoIcon />
      </div>
      <Spacer size='.5rem' />
      Add photo
    </Button>
  )
}

const ModelPrints = ({ model = {}, isAuthedUser, openSignupOverlay = noop }) => {
  const { setOverlay } = useOverlay()
  const c = useStyles()
  const { dispatch, modelAttachments = {} } = useStoreon('modelAttachments')
  const { data: attachments, isLoading } = modelAttachments

  useEffect(() => {
    dispatch(types.FETCH_MODEL_ATTACHMENTS, { modelId: model.id })
  }, [dispatch, model.id])

  const handleImageClick = useCallback(
    initialAttachmentIndex => {
      setOverlay({
        isOpen: true,
        template: 'attachmentView',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          initialAttachmentIndex,
          attachments,
          modelOwnerId: model.owner.id,
          modelId: model.id,
        },
      })
    },
    [setOverlay, attachments, model.owner.id, model.id]
  )

  return (
    <div className={c.ModelPrints}>
      <Title headerLevel={HeaderLevel.tertiary}>Community Uploads</Title>
      {isLoading ? (
        <Spinner />
      ) : attachments.length ? (
        <>
          <Spacer size='2rem' />
          <div className={c.ModelPrints_ImagesWrapper}>
            {attachments.map((a, i) => (
              <img
                key={a.id}
                className={c.ModelPrints_Image}
                src={a.imageUrl}
                alt={a.caption}
                onClick={() => handleImageClick(i)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <Spacer size='.5rem' />
          <Body multiline>No photos added yet, be the first to upload a photo!</Body>
        </>
      )}
      <Spacer size='1.5rem' />
      <AddPrintPhotoLink
        modelId={model.id}
        isAuthedUser={isAuthedUser}
        openSignupOverlay={openSignupOverlay}
      />
    </div>
  )
}

export default ModelPrints
