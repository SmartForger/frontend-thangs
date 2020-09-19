import React, { useCallback, useEffect, useState } from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { Button, Spacer } from '@components'
import ReactTooltip from 'react-tooltip'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes spinner': {
      from: {
        '-moz-transform': 'rotateY(0deg)',
        '-ms-transform': 'rotateY(0deg)',
        transform: 'rotateY(0deg)',
      },
      to: {
        '-moz-transform': 'rotateY(-180deg)',
        '-ms-transform': 'rotateY(-180deg)',
        transform: 'rotateY(-180deg)',
      },
    },
    SaveSearchButton: {},
    SaveSearchIcon: {
      '& path': {
        fill: theme.colors.black[500],
      },
    },
    SaveSearchIcon__saved: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    SaveSearchIcon__unsaved: {
      animation: '$spinner 250ms linear 0s 1 reverse',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
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
      <Button
        className={classnames(c.SaveSearchButton)}
        secondary
        disabled={searchSubscriptions.isLoading || searchSubscriptions.isError}
        onClick={handleSavedClicked}
        data-for='save-search'
        data-tip='Save to your profile'
        data-type='light'
        data-class={c.SaveSearchButton_Tooltip}
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
      {!saved && <ReactTooltip id='save-search' effect='solid' />}
    </>
  )
}
const noop = () => null
const UnauthSaveSearchButton = ({ c, openSignupOverlay = noop }) => {
  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.', 'Like')
    pendo.track('SignUp Prompt Overlay', { source: 'Like' })
  }, [openSignupOverlay])

  return (
    <>
      <Button
        className={classnames(c.SaveSearchButton)}
        onClick={handleClick}
        secondary
        data-for='save-search'
        data-tip='Help us improve! Give us your feedback.'
      >
        <HeartFilledIcon className={c.SaveSearchIcon} />
        <Spacer size='.5rem' />
        Save Search
      </Button>
      <ReactTooltip
        id='save-search'
        className={c.SaveSearchButton_Tooltip}
        place={'top'}
        effect='solid'
      />
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
      />
    )
  }
  return <UnauthSaveSearchButton c={c} openSignupOverlay={openSignupOverlay} />
}

export default SaveSearchButton
