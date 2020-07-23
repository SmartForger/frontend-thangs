import React from 'react'
import { CardCollection } from './'
import { withApolloProvider } from '../../../.storybook/withApolloProvider'
import ThumbnailFixture from '../../../.storybook/fixtures/model-thumbnail.png'
import UserImgFixture from '../../../.storybook/fixtures/user-img.png'

const userFixture = {
  id: '9998',
  fullName: 'Thangs Physna',
  profile: {
    avatarUrl: UserImgFixture,
  },
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

const folderFixture = {
  id: 1,
  name: 'test-folder',
  members: [userFixture, userFixture],
  models: [modelFixture, modelFixture, modelFixture],
}

export default {
  title: 'CardCollection',
  component: CardCollection,
  decorators: [withApolloProvider()],
}

export function SingleRowModels() {
  return (
    <CardCollection models={[modelFixture, modelFixture]}></CardCollection>
  )
}

export function MultipleRowsModels() {
  return (
    <CardCollection
      models={[
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
      ]}
    ></CardCollection>
  )
}

export function NoResults() {
  return (
    <CardCollection
      models={[]}
      noResultsText="No geometric similar matches found. Try uploading another model."
    ></CardCollection>
  )
}

export function SingleRowFolders() {
  return (
    <CardCollection
      folders={[folderFixture, folderFixture]}
    ></CardCollection>
  )
}

export function MultipleRowFolders() {
  return (
    <CardCollection
      folders={[
        folderFixture,
        folderFixture,
        folderFixture,
        folderFixture,
        folderFixture,
        folderFixture,
      ]}
    ></CardCollection>
  )
}

export function MultipleRowModelsAndFolders() {
  return (
    <CardCollection
      models={[
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
        modelFixture,
      ]}
      folders={[
        folderFixture,
        folderFixture,
        folderFixture,
        folderFixture,
        folderFixture,
      ]}
    ></CardCollection>
  )
}
