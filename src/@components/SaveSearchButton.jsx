import React, { useCallback, useEffect, useState } from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { Button, Spacer, Tooltip } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    SaveSearchButton: {},
    SaveSearchIcon: {
      '& path': {
        fill: theme.colors.black[500],
      },
    },
    SaveSearchButton_Tooltip: {
      opacity: '1 !important',
      borderRadius: '.5rem',
      filter: 'drop-shadow(0px 2px 12px rgba(0, 0, 0, 0.2))',
    },
  }
})

const hasSavedSearch = (subscriptionData, searchTerm, modelId) => {
  if (!subscriptionData) return false
  if (modelId) {
    return R.find(R.propEq('modelId', modelId))(subscriptionData)
  }
  return R.find(R.propEq('searchTerm', searchTerm))(subscriptionData)
}

const getSubscriptionId = (subscriptionData, searchTerm, modelId) => {
  if (!subscriptionData) return false
  if (modelId) {
    return R.find('id', R.find(R.propEq('modelId', modelId))(subscriptionData))
  }
  return R.prop('id', R.find(R.propEq('searchTerm', searchTerm))(subscriptionData))
}

const AuthSaveSearchButton = ({
  c,
  modelId,
  searchTerm,
  searchSubscriptions,
  dispatch,
  iconOnly,
}) => {
  const [saved, setSaved] = useState(
    !!hasSavedSearch(searchSubscriptions.data, searchTerm, modelId)
  )
  const [hasChanged, setHasChanged] = useState(false)
  const handleSavedClicked = useCallback(() => {
    const SaveSearch = () => dispatch(types.SAVE_SUBSCRIPTION, { modelId, searchTerm })
    const unSaveSearch = () =>
      dispatch(types.DELETE_SUBSCRIPTION, {
        id: getSubscriptionId(searchSubscriptions.data, searchTerm, modelId),
      })

    if (saved) {
      unSaveSearch()
      setSaved(false)
      setHasChanged(true)
    } else {
      SaveSearch()
      setSaved(true)
      setHasChanged(true)
    }
  }, [saved, dispatch, modelId, searchTerm, searchSubscriptions])

  useEffect(() => {
    dispatch(types.FETCH_SUBSCRIPTIONS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSaved(!!hasSavedSearch(searchSubscriptions.data, searchTerm, modelId))
  }, [modelId, searchSubscriptions, searchTerm])

  return (
    <>
      <Tooltip
        title={saved ? 'Check myThangs for your subscriptions' : 'Save search'}
        arrowLocation={'top'}
      >
        <>
          {!iconOnly && (
            <Button
              className={classnames(c.SaveSearchButton)}
              secondary
              disabled={searchSubscriptions.isLoading || searchSubscriptions.isError}
              onClick={handleSavedClicked}
            >
              {saved ? (
                <HeartFilledIcon
                  className={classnames(c.SaveSearchIcon, {
                    [c.SaveSearchIcon__saved]: hasChanged,
                  })}
                />
              ) : (
                <HeartIcon
                  className={classnames(c.SaveSearchIcon, {
                    [c.SaveSearchIcon__unsaved]: hasChanged,
                  })}
                />
              )}
              <Spacer size='.5rem' />
              {saved ? 'Saved' : 'Save Search'}
            </Button>
          )}
          {iconOnly &&
            (saved ? (
              <HeartFilledIcon
                className={classnames(c.SaveSearchIcon, {
                  [c.SaveSearchIcon__saved]: hasChanged,
                })}
                onClick={handleSavedClicked}
              />
            ) : (
              <HeartIcon
                className={classnames(c.SaveSearchIcon, {
                  [c.SaveSearchIcon__unsaved]: hasChanged,
                })}
                onClick={handleSavedClicked}
              />
            ))}
        </>
      </Tooltip>
    </>
  )
}
const noop = () => null
const UnauthSaveSearchButton = ({ c, openSignupOverlay = noop, iconOnly }) => {
  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.', 'Like')
    track('SignUp Prompt Overlay', { source: 'Like' })
  }, [openSignupOverlay])

  return (
    <>
      {!iconOnly && (
        <>
          <Button
            className={classnames(c.SaveSearchButton)}
            onClick={handleClick}
            secondary
          >
            <HeartFilledIcon className={c.SaveSearchIcon} />
            <Spacer size='.5rem' />
            Save Search
          </Button>
        </>
      )}
      {iconOnly && (
        <>
          <HeartFilledIcon className={c.SaveSearchIcon} onClick={handleClick} />
        </>
      )}
    </>
  )
}

const SaveSearchButton = ({
  currentUser,
  searchTerm,
  modelId,
  openSignupOverlay = noop,
  dispatch = noop,
  searchSubscriptions,
  iconOnly = false,
}) => {
  const c = useStyles()
  if (currentUser) {
    return (
      <AuthSaveSearchButton
        c={c}
        modelId={modelId}
        searchTerm={searchTerm}
        searchSubscriptions={searchSubscriptions}
        dispatch={dispatch}
        iconOnly={iconOnly}
      />
    )
  }
  return (
    <Tooltip title={'Sign up to save your searches'} arrowLocation={'top'}>
      <UnauthSaveSearchButton
        c={c}
        openSignupOverlay={openSignupOverlay}
        iconOnly={iconOnly}
      />
    </Tooltip>
  )
}

export default SaveSearchButton
