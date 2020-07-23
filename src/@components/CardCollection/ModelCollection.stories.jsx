import React from 'react'
import ModelCollection from './ModelCollection'
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

export default {
  title: 'ModelCollection',
  component: ModelCollection,
}

export function SingleRowModels() {
  return <ModelCollection models={[modelFixture, modelFixture]}></ModelCollection>
}

export function MultipleRowsModels() {
  return (
    <ModelCollection
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
    ></ModelCollection>
  )
}

export function NoResults() {
  return (
    <ModelCollection
      models={[]}
      noResultsText='No geometric similar matches found. Try uploading another model.'
    ></ModelCollection>
  )
}
