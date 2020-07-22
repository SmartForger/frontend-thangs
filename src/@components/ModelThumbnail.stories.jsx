import React from 'react'
import { ModelThumbnail } from './ModelThumbnail'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelThumbnail_container: {
      background: 'white',
      width: '200px',
      height: '200px',
    },
  }
})

export function ModelThumbnailLoading() {
  const c = useStyles()
  return (
    <div className={c.ModelThumbnail_container}>
      <ModelThumbnail
        name='Example: Pikachu'
        thumbnailUrl='http://slowwly.robertomurray.co.uk/delay/10000/url/https://i.pinimg.com/originals/76/47/9d/76479dd91dc55c2768ddccfc30a4fbf5.png'
      />
    </div>
  )
}

export function ModelThumbnailComplete() {
  const c = useStyles()
  return (
    <div className={c.ModelThumbnail_container}>
      <ModelThumbnail
        name='Example: Pikachu'
        thumbnailUrl='https://i.pinimg.com/originals/76/47/9d/76479dd91dc55c2768ddccfc30a4fbf5.png'
      />
    </div>
  )
}

export function ModelThumbnailError() {
  const c = useStyles()
  return (
    <div className={c.ModelThumbnail_container}>
      <ModelThumbnail name='Example: Pikachu' thumbnailUrl='#' />
    </div>
  )
}

export default {
  title: 'ModelThumbnail',
  component: ModelThumbnail,
}
