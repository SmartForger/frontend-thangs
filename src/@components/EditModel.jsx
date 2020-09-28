import React, { useRef, useState, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { EditModelForm, Spacer } from '@components'
import { createUseStyles } from '@style'
import * as R from 'ramda'
import { ReactComponent as EditIcon } from '@svg/icon-pencil.svg'
import * as types from '@constants/storeEventTypes'
import { useRouteMatch } from 'react-router-dom'
import { FETCH_TYPES } from '@store/models/consts'

const useStyles = createUseStyles(theme => {
  const isconSelectedState = {
    color: theme.colors.black[500],
  }
  return {
    EditModel: {},
    EditModel_EditIcon: {
      color: theme.colors.grey[300],
      position: 'absolute',
      top: 0,
      right: 0,
      padding: '1rem',
      '&:hover': {
        ...isconSelectedState,
      },
      cursor: 'pointer',
    },
    EditModel_EditIcon__selected: {
      ...isconSelectedState,
    },
    EditModel_Message: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '0.5rem',
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      display: 'flex',
      fontSize: '1rem',
      fontWeight: 500,
      height: '100%',
      justifyContent: 'space-around',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1,
    },
    EditModel_FormWrapper: {
      backgroundColor: theme.colors.white[300],
    },
    FeedbackTooltip_Link: {
      width: '100%',
      textAlign: 'right',
      marginTop: '0.5rem',
      '& * ': {
        cursor: 'pointer',
        marginRight: '0.5rem',
      },
    },
  }
})

const EditModel = ({ model, editProfileErrorMessage }) => {
  const c = useStyles()
  const messageContainer = useRef(null)
  const { dispatch } = useStoreon()

  const ownFolderMatch = useRouteMatch({
    path: '/folder/:id/',
  })

  const ownModelsMatch = useRouteMatch({
    path: '/home',
  })

  const userNameMatch = useRouteMatch({
    path: '/:userName',
  })

  const fetchData = {
    type: R.isNil(ownFolderMatch) ? FETCH_TYPES.OWN_MODELS : FETCH_TYPES.FOLDER,
    ...(R.path(['params', 'id'], ownFolderMatch) && {
      folderId: R.path(['params', 'id'], ownFolderMatch),
    }),
  }
  const [isOpened, setIsOpened] = useState(false)

  const handleUpdateModel = useCallback(
    newModelData => {
      const { id, ...updatedModel } = newModelData
      dispatch(types.UPDATE_MODEL, {
        id,
        model: updatedModel,
        onError: error => {
          editProfileErrorMessage(error)
        },
        onFinish: () => {
          setIsOpened(false)
        },
      })
    },
    [dispatch, editProfileErrorMessage]
  )

  const handleDelete = useCallback(
    e => {
      e.preventDefault()
      dispatch(types.DELETE_MODEL, {
        id: model.id,
        fetchData,
      })
    },
    [dispatch, model, fetchData]
  )

  const handleCancel = useCallback(e => {
    e.preventDefault()
    setIsOpened(false)
  }, [])

  const handleClickOutside = event => {
    if (messageContainer.current && !messageContainer.current.contains(event.target)) {
      setIsOpened(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  if (R.isNil(ownFolderMatch) && R.isNil(ownModelsMatch) && R.isNil(userNameMatch))
    return null

  return (
    <>
      <EditIcon
        className={classnames(
          c.EditModel_EditIcon,
          isOpened && c.EditModel_EditIcon__selected
        )}
        onClick={() => {
          setIsOpened(true)
        }}
      />
      {isOpened && (
        <div className={c.EditModel_Message} ref={messageContainer}>
          <Spacer size={'1rem'} />
          <EditModelForm
            model={model}
            handleCancel={handleCancel}
            handleConfirm={handleUpdateModel}
            handleDelete={handleDelete}
          />
          <Spacer size={'1rem'} />
        </div>
      )}
    </>
  )
}

export default EditModel
