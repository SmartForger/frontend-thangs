import React from 'react'
import FolderCard from './'
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
  title: 'FolderCard',
  component: FolderCard,
  decorators: [withApolloProvider()],
}

const userFixture = {
  id: '9998',
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  fullName: 'Thangs Physna',
  profile: {
    avatarUrl: UserImgFixture,
  },
  inviteCode: null,
  likedModels: [],
  models: [],
  isBeingFollowedByRequester: false,
}

const modelFixture = {
  id: '9999',
  uploadStatus: 'COMPLETED',
  name: 'Awesome model',
  likesCount: 100,
  commentsCount: 523,
  owner: userFixture,
  thumbnailUrl: ThumbnailFixture,
}

export const WithManyModels = () => {
  const c = useStyles()
  const folderFixture = {
    id: 1,
    name: 'test-folder',
    members: [userFixture, userFixture],
    models: [modelFixture, modelFixture, modelFixture],
  }
  return (
    <div className={c.Container}>
      <FolderCard folder={folderFixture}></FolderCard>
    </div>
  )
}

export const WithSingleModel = () => {
  const c = useStyles()
  const folderFixture = {
    id: 1,
    name: 'test-folder',
    members: [userFixture, userFixture],
    models: [modelFixture],
  }
  return (
    <div className={c.Container}>
      <FolderCard folder={folderFixture}></FolderCard>
    </div>
  )
}

export const WithNoModels = () => {
  const c = useStyles()
  const folderFixture = {
    id: 1,
    name: 'test-folder',
    members: [userFixture, userFixture],
    models: [],
  }
  return (
    <div className={c.Container}>
      <FolderCard folder={folderFixture}></FolderCard>
    </div>
  )
}
