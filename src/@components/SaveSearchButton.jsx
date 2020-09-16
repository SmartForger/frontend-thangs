import React, { useCallback, useEffect, useState } from 'react'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { Button, Spacer } from '@components'
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
  }
})

const hasSavedSearch = (subscriptionData, currentUserId) => {
  return R.includes(currentUserId, subscriptionData)
}

const AuthSaveSearchButton = ({ c, modelId, searchTerm }) => {
  const { dispatch, searchSubscriptions = {} } = useStoreon('searchSubscriptions')
  const [saved, setSaved] = useState(hasSavedSearch(false))
  const [hasChanged, setHasChanged] = useState(false)
  const handleLikeClicked = useCallback(() => {
    const SaveSearch = () => dispatch(types.SAVE_SUBSCRIPTION, { modelId, searchTerm })
    const unSaveSearch = () => dispatch(types.DELETE_SUBSCRIPTION, { id: modelId })

    if (saved) {
      unSaveSearch()
      setSaved(false)
      setHasChanged(true)
    } else {
      SaveSearch()
      setSaved(true)
      setHasChanged(true)
    }
  }, [saved, dispatch, modelId, searchTerm])

  useEffect(() => {
    dispatch(types.FETCH_SUBSCRIPTIONS)
  }, [dispatch])

  return (
    <Button
      className={classnames(c.SaveSearchButton)}
      secondary
      disabled={searchSubscriptions.isLoading || searchSubscriptions.isError}
      onClick={handleLikeClicked}
    >
      <div>
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
      </div>
      <Spacer size='.5rem' />
      {saved ? 'Saved' : 'Save Search'}
    </Button>
  )
}
const noop = () => null
const UnauthSaveSearchButton = ({ c, openSignupOverlay = noop }) => {
  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.')
    pendo.track('SignUp Prompt Overlay', { source: 'Like' })
  }, [openSignupOverlay])

  return (
    <Button className={classnames(c.SaveSearchButton)} onClick={handleClick} secondary>
      <HeartFilledIcon className={c.SaveSearchIcon} />
      <Spacer size='.5rem' />
      Save Search
    </Button>
  )
}

const SaveSearchButton = ({
  currentUser,
  searchTerm,
  modelId,
  openSignupOverlay = noop,
}) => {
  const c = useStyles()
  if (currentUser) {
    return <AuthSaveSearchButton c={c} modelId={modelId} searchTerm={searchTerm} />
  }
  return <UnauthSaveSearchButton c={c} openSignupOverlay={openSignupOverlay} />
}

export default SaveSearchButton
