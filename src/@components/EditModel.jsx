import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import * as R from 'ramda'
import { ReactComponent as EditIcon } from '@svg/icon-pencil.svg'
import * as types from '@constants/storeEventTypes'
import { useRouteMatch } from 'react-router-dom'
import { FETCH_TYPES } from '@store/userOwnModels/consts'

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

const EditModel = ({ model }) => {
  const c = useStyles()
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

  const handleClick = useCallback(
    e => {
      e.preventDefault()
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'editModel',
        overlayData: {
          model,
          fetchData,
          user: model.owner,
          animateIn: true,
          windowed: true,
        },
      })
    },
    [dispatch, fetchData, model]
  )

  if (R.isNil(ownFolderMatch) && R.isNil(ownModelsMatch) && R.isNil(userNameMatch))
    return null

  return (
    <>
      <EditIcon className={c.EditModel_EditIcon} onClick={handleClick} />
    </>
  )
}

export default EditModel
