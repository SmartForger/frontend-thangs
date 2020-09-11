import React, { useRef, useState, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'

import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import * as eventTypes from '@constants/storeEventTypes'

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
    FeedbackTooltip_Message: {
      backgroundColor: theme.colors.white[100],
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      borderRadius: '0.5rem',
      ...theme.mixins.text.viewerLoadingText,
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
  const ccc = useRef(null)
  const { dispatch } = useStoreon()

  const [isOpened, setIsOpened] = useState(false)

  const handleConfirm = useCallback(
    e => {
      e.preventDefault()
      dispatch(eventTypes.DELETE_OWN_MODEL, { id: modelId })
    },
    [dispatch, modelId]
  )

  const handleCancel = useCallback(e => {
    e.preventDefault()
    setIsOpened(false)
  }, [])

  const handleClickOutside = event => {
    if (ccc.current && !ccc.current.contains(event.target)) {
      setIsOpened(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

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
        <div className={c.FeedbackTooltip_Message} ref={ccc}>
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
