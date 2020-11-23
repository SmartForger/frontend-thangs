import React, { useEffect, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { CardCollection, ModelCards, Spinner, Spacer, TitleTertiary } from '@components'
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
      [md]: {
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
      <Spacer size='2rem' />
      <div className={c.LikedModels_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Liked Models</TitleTertiary>
        <Spacer size='2rem' />
        <CardCollection noResultsText='You have not liked any models yet.'>
          <ModelCards items={filteredModels} />
        </CardCollection>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default LikedModelsView
