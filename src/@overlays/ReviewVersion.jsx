import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

const getPartsByPartId = (files, formData, modelData = {}) =>
  Object.keys(files)
    .map(fileKey => {
      return formData[fileKey].previousParts.map(partId => {
        const previousPart =
          (modelData.parts &&
            modelData.parts.find(part => part.partIdentifier === partId)) ||
          {}
        return {
          ...previousPart,
          newFileKey: fileKey,
        }
      })
    })
    .flat()

const ReviewVersion = () => {
  const c = useStyles()
  const { dispatch, uploadModelFiles = {}, model = {} } = useStoreon(
    'model',
    'uploadModelFiles'
  )
  const { data: files = {}, formData } = uploadModelFiles
  const { data: modelData = {}, isLoading: isLoadingModel } = model
  const modelId = modelData && modelData.id
  const [isWaiting, setIsWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { setOverlay } = useOverlay()
  const parts = getPartsByPartId(files, formData, modelData)

  const initialState = useMemo(() => {
    const partNames = Object.keys(files)
      .map(fileKey => {
        return formData[fileKey].previousParts.map(
          partId =>
            (modelData?.parts?.find(part => part.partIdentifier === partId) || {})?.name
        )
      })
      .flat()
    return {
      message: `Updated ${partNames.join(', ')}.`,
    }
  }, [files, formData, modelData.parts])

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const formSubmit = useCallback(
    async (inputState, isValid, _errors) => {
      if (isValid) {
        setIsWaiting(true)
        dispatch(types.SUBMIT_NEW_VERSION, {
          modelId,
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
              },
            })
          },
          onError: () => {
            setIsWaiting(false)
            setErrorMessage(
              'Oh no! Something went wrong on our end. Sorry about that! Please try again later.'
            )
          },
        })
      }
    },
    [dispatch, modelId, setOverlay]
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

  const handleClose = useCallback(() => {
    dispatch(types.RESET_UPLOAD_FILES)
  }, [dispatch])

  useEffect(() => {
    overlayview('ReviewVersion')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const compareModels = useMemo(() => {
    return parts.map(part => {
      const { newFileKey, ...oldPart } = part
      return {
        model1: oldPart,
        model2: files[newFileKey],
      }
    })
  }, [files, parts])

  return (
    <OverlayWrapper
      overlayHeader={'Review & Confirm'}
      overlayTitle={'Submit your version changes'}
      overlaySubTitle={
        'Review your model changes and write a message to keep track of your version history.'
      }
      isLoading={isWaiting || isLoadingModel}
      onCancel={handleBack}
      onClose={handleClose}
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
      <Compare models={compareModels} />
      <Spacer size={'1rem'} />
      <form className={c.ReviewVersion_Form}>
        <Textarea
          className={c.ReviewVersion_TextArea}
          label={'Version message'}
          name='message'
          onChange={handleOnInputChange}
          placeholder={'Add a message describing your changes'}
          required
          value={inputState && inputState.message}
        />
      </form>
    </OverlayWrapper>
  )
}

export default ReviewVersion
