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

const StatsBar = () => {
  const c = useStyles({})

  return (
    <div className={c.StatsBar}>
      <div className={c.StatsBar_Stat}>
        <SharedIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>2,293</TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Contributon</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <ModelIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>231</TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Models</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <HeartIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>1,295</TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Likes</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <PlusIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>239</TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Following</MetadataPrimary>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <PlusIcon />
        <Spacer size={'1rem'} />
        <div>
          <TitleTertiary>23</TitleTertiary>
          <Spacer size='.5rem' />
          <MetadataPrimary>Followers</MetadataPrimary>
        </div>
      </div>
    </div>
  )
}

export default StatsBar
