import React, { useCallback, useEffect, useState } from 'react'
import { Compare, Spacer, Textarea, OverlayWrapper } from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { overlayview } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    ReviewVersion_Form: {
      display: 'flex',
      margin: '2rem 0',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    ReviewVersion_TextArea: {
      width: '100%',
      marginBottom: '.75rem',
      resize: 'none',
      minHeight: '2.5rem',
      border: 'none',
      boxSizing: 'border-box',
      padding: '.5rem',
      lineHeight: '1.5rem',
      borderRadius: '.25rem',

      '&:focus': {
        outline: 'none',
      },
    },
    ReviewVersion_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: '500',
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
  }
})

const ReviewVersion = ({ model = {}, part = {}, files }) => {
  const c = useStyles()
  const { dispatch, uploadFiles = {} } = useStoreon('uploadFiles')
  const { formData } = uploadFiles
  const [waiting, setWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { setOverlay } = useOverlay()
  // When coming from model page we have model and model.id
  const modelId = (model && model.id) || (part && part.modelId)
  const initialState = {
    message: `Updated ${part && part.name}.`,
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const formSubmit = useCallback(
    async (inputState, isValid, _errors) => {
      if (isValid) {
        setWaiting(true)
        dispatch(types.SUBMIT_NEW_VERSION, {
          modelId,
          part,
          message: inputState.message,
          onFinish: () => {
            dispatch(types.RESET_UPLOAD_FILES)
            setOverlay({
              isOpen: true,
              template: 'versionPublished',
              data: {
                animateIn: false,
                windowed: true,
                dialogue: true,
                modelId,
              },
            })
          },
          onError: () => {
            setWaiting(false)
            setErrorMessage(
              'Oh no! Something went wrong on our end. Sorry about that! Please try again later.'
            )
          },
        })
      }
    },
    [dispatch, modelId, part, setOverlay]
  )

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleBack = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'multiUpload',
      data: {
        animateIn: true,
        windowed: true,
        dialogue: true,
        versionData: {
          modelId,
        },
      },
    })
  }, [modelId, setOverlay])

  useEffect(() => {
    overlayview('ReviewVersion')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <OverlayWrapper
      overlayHeader={'Review & Confirm'}
      overlayTitle={'Submit your version changes'}
      overlaySubTitle={
        'Review your model changes and write a message to keep track of your version history.'
      }
      isLoading={waiting}
      onCancel={handleBack}
      onContinue={onFormSubmit(formSubmit)}
      cancelText={'Back'}
      continueText={'Submit'}
    >
      {errorMessage && (
        <>
          <h4 className={c.ReviewVersion_ErrorText}>{errorMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      {Object.keys(files).map((fileKey, ind) => (
        <>
          <Compare
            key={`CompareViewer_${ind}`}
            model1={formData && formData[fileKey] && formData[fileKey].previousParts}
            model2={files[fileKey]}
          />
          <Spacer size={'1rem'} />
        </>
      ))}
      <form className={c.ReviewVersion_Form}>
        <Textarea
          className={c.ReviewVersion_TextArea}
          name='message'
          value={inputState && inputState.message}
          onChange={handleOnInputChange}
          placeholder={'Add a message describing your changes'}
          required
        />
      </form>
    </OverlayWrapper>
  )
}

export default ReviewVersion
