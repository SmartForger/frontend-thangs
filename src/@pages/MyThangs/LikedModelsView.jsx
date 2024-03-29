import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { CardCollection, ModelCards, Spinner, Spacer } from '@components'
import * as types from '@constants/storeEventTypes'
import { pageview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    LikedModels: {
      display: 'flex',
      flexDirection: 'row',
    },
    LikedModels_Content: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1.5rem',
      marginRight: '1.5rem',
      [md]: {
        marginLeft: '2rem',
        minWidth: '56rem',
      },
    },
    LikedModels_Spinner: {
      marginTop: '10rem',
    },
  }
})

const LikedModelsView = ({ className, userId }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const { [`user-liked-models-${userId}`]: likedUserModelsAtom = {} } = useStoreon(
    `user-liked-models-${userId}`
  )

  useEffect(() => {
    pageview('MyThangs - LikedModels')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(types.FETCH_USER_LIKED_MODELS, { id: userId })
  }, [dispatch, userId])

  const { data = {}, isLoading } = likedUserModelsAtom
  const { models = [] } = data
  const filteredModels = useMemo(() => {
    if (!models || !models.length) return []
    return models.filter(
      ({ owner }) => owner && owner.id && owner.id.toString() !== userId.toString()
    )
  }, [userId, models])

  if (isLoading) {
    return (
      <main className={classnames(className, c.LikedModels)}>
        <Spinner className={c.LikedModels_Spinner} />
      </main>
    )
  }

  return (
    <main className={classnames(className, c.LikedModels)}>
      <div className={c.LikedModels_Content}>
        <Spacer size='2rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Liked Models</Title>
        <Spacer size='2rem' />
        <CardCollection noResultsText='You have not liked any models yet.'>
          <ModelCards items={filteredModels} />
        </CardCollection>
      </div>
    </main>
  )
}

export default LikedModelsView
