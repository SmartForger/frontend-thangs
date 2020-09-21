import React, { useRef, useState, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import * as R from 'ramda'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import * as eventTypes from '@constants/storeEventTypes'
import { useRouteMatch } from 'react-router-dom'
import { FETCH_TYPES } from '@store/models/consts'

const useStyles = createUseStyles(theme => {
  const isconSelectedState = {
    color: theme.colors.black[500],
  }
  return {
    DeleteModel: {},
    DeleteModel_TrashIcon: {
      color: theme.colors.grey[300],
      '&:hover': {
        ...isconSelectedState,
      },
      cursor: 'pointer',
    },
    DeleteModel_TrashIcon__selected: {
      ...isconSelectedState,
    },
    DeleteModel_Message: {
      backgroundColor: theme.colors.white[100],
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      borderRadius: '0.5rem',
      ...theme.text.viewerLoadingText,
      padding: '1rem 1rem',

      position: 'absolute',
      bottom: '1rem',
      right: '1rem',
      width: '17rem',
      zIndex: 1,
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

const DeleteModel = ({ modelId, className }) => {
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

  const handleConfirm = useCallback(
    e => {
      e.preventDefault()
      dispatch(eventTypes.DELETE_MODEL, {
        modelId,
        fetchData,
      })
    },
    [dispatch, modelId, fetchData]
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
    <div className={classnames(className, c.DeleteModel)}>
      <TrashCanIcon
        className={classnames(
          c.DeleteModel_TrashIcon,
          isOpened && c.DeleteModel_TrashIcon__selected
        )}
        onClick={() => {
          setIsOpened(true)
        }}
      />
      {isOpened && (
        <div className={c.DeleteModel_Message} ref={messageContainer}>
          <div>Are you sure you want to delete?</div>
          <div className={c.FeedbackTooltip_Link}>
            <a href='/#' onClick={handleCancel}>
              Cancel
            </a>
            <a href='/#' onClick={handleConfirm}>
              Confirm
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeleteModel
