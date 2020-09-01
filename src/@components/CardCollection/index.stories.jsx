import React from 'react'
import CardCollection from './'
import ModelCards from './ModelCards'
import FolderCards from './FolderCards'
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
}

export const SingleRowModels = () => {
  return (
    <CardCollection>
      <ModelCards items={[modelFixture, modelFixture]} />
    </CardCollection>
  )
}

export const MultipleRowsModels = () => {
  return (
    <CardCollection>
      <ModelCards
        items={[
          modelFixture,
          modelFixture,
          modelFixture,
          modelFixture,
          modelFixture,
          modelFixture,
          modelFixture,
          modelFixture,
        ]}
      />
    </CardCollection>
  )
}

export const NoResults = () => {
  return (
    <CardCollection noResultsText='No geometric similar matches found. Try uploading another model.'>
      <ModelCards items={[]} />
    </CardCollection>
  )
}

export const SingleRowFolders = () => {
  return (
    <CardCollection>
      <FolderCards items={[folderFixture, folderFixture]} />
    </CardCollection>
  )
}

export const MultipleRowFolders = () => {
  return (
    <CardCollection>
      <FolderCards
        items={[
          folderFixture,
          folderFixture,
          folderFixture,
          folderFixture,
          folderFixture,
          folderFixture,
        ]}
      />
    </CardCollection>
  )
}

export const MultipleRowModelsAndFolders = () => {
  return (
    <CardCollection>
      <ModelCards
        items={[modelFixture, modelFixture, modelFixture, modelFixture, modelFixture]}
      />
      <FolderCards
        folders={[
          folderFixture,
          folderFixture,
          folderFixture,
          folderFixture,
          folderFixture,
        ]}
      />
    </CardCollection>
  )
}
