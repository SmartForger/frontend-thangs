import React from 'react'
import { ModelCard } from './'
import { withApolloProvider } from '../../../.storybook/withApolloProvider'
import ThumbnailFixture from '../../../.storybook/fixtures/model-thumbnail.png'
import UserImgFixture from '../../../.storybook/fixtures/user-img.png'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Container: {
      width: '21.5rem',
      height: '16.75rem',
    },
  }
})

export default {
  title: 'ModelCard',
  component: ModelCard,
  decorators: [withApolloProvider()],
}

const modelFixture = {
  id: '9999',
  uploadStatus: 'COMPLETED',
  name: 'Awesome model',
  likesCount: 100,
  commentsCount: 523,
  owner: {
    id: '9998',
    fullName: 'Thangs Physna',
    profile: {
      avatarUrl: UserImgFixture,
    },
  },
  thumbnailUrl: ThumbnailFixture,
}

export function WithOwner() {
  const c = useStyles()
  return (
    <div className={c.Container}>
      <ModelCard model={modelFixture} withOwner></ModelCard>
    </div>
  )
}

export function WithoutOwner() {
  const c = useStyles()
  return (
    <div className={c.Container}>
      <ModelCard model={modelFixture}></ModelCard>
    </div>
  )
}
