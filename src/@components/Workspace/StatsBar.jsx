import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
} from '@physna/voxel-ui/@atoms/Typography'

import { Spacer } from '@components'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { ReactComponent as SharedIcon } from '@svg/icon-shared.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    StatsBar: {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',
      [md]: {
        overflowX: 'hidden',
      },
    },
    StatsBar_Stat: {
      display: 'flex',
      flexDirection: 'row',

      '& h3': {
        lineHeight: '1rem',
      },
    },
    StatsBar_StatText: {
      margin: 0,
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
          <Title headerLevel={HeaderLevel.tertiary}>
            {typeof userActivity.contributions === 'number'
              ? userActivity.contributions
              : '-'}
          </Title>
          <Spacer size='.5rem' />
          <Metadata type={MetadataType.primary} className={c.StatsBar_StatText}>
            Contributions
          </Metadata>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <ModelIcon />
        <Spacer size={'1rem'} />
        <div>
          <Title headerLevel={HeaderLevel.tertiary}>
            {typeof userActivity.uploads === 'number' ? userActivity.uploads : '-'}
          </Title>
          <Spacer size='.5rem' />
          <Metadata type={MetadataType.primary} className={c.StatsBar_StatText}>
            Models
          </Metadata>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <HeartIcon />
        <Spacer size={'1rem'} />
        <div>
          <Title headerLevel={HeaderLevel.tertiary}>
            {typeof userActivity.likes === 'number' ? userActivity.likes : '-'}
          </Title>
          <Spacer size='.5rem' />
          <Metadata type={MetadataType.primary} className={c.StatsBar_StatText}>
            Likes
          </Metadata>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <PlusIcon />
        <Spacer size={'1rem'} />
        <div>
          <Title headerLevel={HeaderLevel.tertiary}>
            {typeof userActivity.following === 'number' ? userActivity.following : '-'}
          </Title>
          <Spacer size='.5rem' />
          <Metadata type={MetadataType.primary} className={c.StatsBar_StatText}>
            Following
          </Metadata>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.StatsBar_Stat}>
        <PlusIcon />
        <Spacer size={'1rem'} />
        <div>
          <Title headerLevel={HeaderLevel.tertiary}>
            {typeof userActivity.followers === 'number' ? userActivity.followers : '-'}
          </Title>
          <Spacer size='.5rem' />
          <Metadata type={MetadataType.primary} className={c.StatsBar_StatText}>
            Followers
          </Metadata>
        </div>
      </div>
      <Spacer size={'3rem'} />
    </div>
  )
}

export default StatsBar
