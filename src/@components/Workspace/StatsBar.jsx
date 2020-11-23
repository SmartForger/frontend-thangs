import React from 'react'
import { Spacer, TitleTertiary, MetadataPrimary } from '@components'
import { createUseStyles } from '@style'

import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { ReactComponent as SharedIcon } from '@svg/icon-shared.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'

const useStyles = createUseStyles(_theme => {
  return {
    StatsBar: {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',
    },
    StatsBar_Stat: {
      display: 'flex',
      flexDirection: 'row',

      '& h3': {
        lineHeight: '1rem',
      },
    },
  }
})

const StatsBar = ({ userActivity = {} }) => {
  const c = useStyles({})

  return (
    <div className={c.StatsBar}>
      <div className={c.StatsBar_Stat}>
        <SharedIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>
            {typeof userActivity.contributions === 'number'
              ? userActivity.contributions
              : '-'}
          </TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Contributions</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <ModelIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>
            {typeof userActivity.uploads === 'number' ? userActivity.uploads : '-'}
          </TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Models</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <HeartIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>
            {typeof userActivity.likes === 'number' ? userActivity.likes : '-'}
          </TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Likes</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <PlusIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>
            {typeof userActivity.following === 'number' ? userActivity.following : '-'}
          </TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Following</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <PlusIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>
            {typeof userActivity.followers === 'number' ? userActivity.followers : '-'}
          </TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Followers</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
    </div>
  )
}

export default StatsBar
