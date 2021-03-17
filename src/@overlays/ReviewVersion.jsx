import React, { useCallback, useEffect, useState } from 'react'
import { Compare, Spacer, Textarea, OverlayWrapper } from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
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
  const [waiting, setWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { setOverlay } = useOverlay()
  const { dispatch } = useStoreon()
  const modelId = (model && model.modelId) || (part && part.modelId)
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
            setErrorMessage('Submitting new version failed')
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
        model,
        part,
      },
    })
  }, [model, part, setOverlay])

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
      continueText={'Submit'}
    >
      {Object.keys(files).map((fileKey, ind) => (
        <Compare
          key={`CompareViewer_${ind}`}
          model1={model || part}
          model2={files[fileKey]}
        />
      ))}
      <form className={c.ReviewVersion_Form}>
        {errorMessage && (
          <>
            <h4 className={c.ReviewVersion_ErrorText}>{errorMessage}</h4>
            <Spacer size='1rem' />
          </>
        )}
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
