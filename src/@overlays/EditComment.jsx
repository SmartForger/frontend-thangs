import React, { useCallback, useEffect, useState } from 'react'
import { Button, Spacer, Spinner, Textarea } from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { overlayview } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import MobileDesktopTitle from '../@components/MobileDesktopTitle'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    EditComment: {
      height: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      width: '100%',

      [md]: {
        width: 'unset',
        height: 'unset',
        flexDirection: 'row',
      },
    },
    EditComment_Column: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        height: 'unset',
        flexDirection: 'row',
      },
    },
    EditComment_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
    },
    EditComment_Wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        height: 'unset',
      },
    },
    EditComment_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    EditComment_LoaderScreen: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: '5',
      borderRadius: '1rem',
      display: 'flex',
    },
    CommentForm: {
      display: 'flex',
      margin: '2rem 0',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    CommentForm_PostCommentTextArea: {
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
    CommentForm_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: '500',
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
  }
})

const EditComment = ({ modelId, comment }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch, comments = {} } = useStoreon('comments')
  const { setOverlayOpen } = useOverlay()
  const { isSaving } = comments

  const initialState = {
    body: comment.body,
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const formSubmit = useCallback(
    async (inputState, isValid, _errors) => {
      if (isValid) {
        dispatch(types.UPDATE_MODEL_COMMENT, {
          modelId,
          commentId: comment.id,
          body: inputState.body,
          onFinish: () => {
            closeOverlay()
          },
          onError: () => {
            setErrorMessage('Editing comment failed')
          },
        })
      }
    },
    [dispatch, comment, modelId, closeOverlay]
  )

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  useEffect(() => {
    overlayview('EditComment')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.EditComment}>
      {isSaving && (
        <div className={c.EditComment_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.EditComment_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.EditComment_Column, c.EditComment_EditForm)}>
        <Spacer className={c.EditComment_MobileSpacer} size='2rem' />
        <div className={c.EditComment_Wrapper}>
          <Spacer size='4rem' />
          <MobileDesktopTitle>Edit Comment</MobileDesktopTitle>
          <Spacer size='1rem' />
          <form className={c.CommentForm} onSubmit={onFormSubmit(formSubmit)}>
            {errorMessage && (
              <>
                <h4 className={c.CommentForm_ErrorText}>{errorMessage}</h4>
                <Spacer size='1rem' />
              </>
            )}
            <Textarea
              className={c.CommentForm_PostCommentTextArea}
              name='body'
              value={inputState && inputState.body}
              onChange={handleOnInputChange}
              placeholder={'Add a public comment'}
              required
            />
            <Button type='submit'>Update</Button>
          </form>
        </div>
        <Spacer className={c.EditComment_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default EditComment
