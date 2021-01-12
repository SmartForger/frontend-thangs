import React, { useCallback, useState } from 'react'
import * as R from 'ramda'
import ErrorImg from '@svg/image-error-icon.svg'
import { Loader } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { track } from '@utilities/analytics'
import * as path from 'path'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
    ModelThumbnail: {
      ...theme.text.thumbnailErrorText,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '1rem .5rem',
      position: 'relative',

      '& > svg': {
        display: 'block',
        height: '100%',
        position: 'absolute',
        width: '2rem',
      },

      '& img': {
        display: 'block',
        height: 'auto',
        margin: 'auto',
        maxWidth: '100%',
        transform: ({ mini }) => (mini ? 'none' : 'scale(.85)'),

        '&:before': {
          backgroundColor: theme.variables.colors.cardBackground,
          backgroundImage: `url(${ErrorImg})`,
          backgroundPosition: ({ mini }) => (mini ? 'center center' : 'center 37%'),
          backgroundRepeat: 'no-repeat',
          content: '""',
          display: 'block',
          height: '100%',
          left: ({ mini }) => (mini ? '-4px' : 0),
          padding: ({ mini }) => (mini ? '.25rem' : 'none'),
          position: 'absolute',
          top: ({ mini }) => (mini ? '-3px' : 0),
          transform: ({ mini }) => (mini ? 'scale(.5)' : 'scale(1.15)'),
          width: '100%',
        },

        '&:after': {
          content: '"Image Unavailable"',
          display: ({ mini }) => (mini ? 'none' : 'block'),
          left: '50%',
          position: 'absolute',
          textAlign: 'center',
          top: '72.5%',
          transform: 'translateX(-50%) scale(1.15)',
        },
      },
    },
    ModelThumbnail_Loader: {
      boxShadow: ({ mini }) =>
        mini
          ? `inset 0 0 0 8px ${theme.colors.gold[500]}`
          : `inset 0 0 0 12px ${theme.colors.gold[500]}`,
      height: ({ mini }) => (mini ? '1.5rem' : '3rem'),
      position: 'absolute',
      width: ({ mini }) => (mini ? '1.5rem' : '3rem'),
    },
    ModelThumbnail_Error: {
      transform: 'none !important',
    },
  }
})

const LOADING = 'LOADING'
const COMPLETE = 'COMPLETE'
const ERROR = 'ERROR'

const THUMBNAILS_FOLDER = process.env.REACT_APP_THUMBNAILS_FOLDER
const THUMBNAILS_HOST = process.env.REACT_APP_THUMBNAILS_HOST
const REACT_APP_MODEL_BUCKET = process.env.REACT_APP_MODEL_BUCKET

const thumbnailUrl = (model, useThumbnailer) => {
  if (model.fullThumbnailUrl) return model.fullThumbnailUrl
  if (model.thumbnailUrl) return model.thumbnailUrl
  let modelUri = useThumbnailer
    ? `${THUMBNAILS_HOST}${getThumbnailUrl(model)}`
    : `${REACT_APP_MODEL_BUCKET}${getThumbnailUrl(model)}`
  if (useThumbnailer) return modelUri
  return modelUri.replace(/\s/g, '_').replace(path.extname(modelUri), '.png')
}

const getThumbnailUrl = (model = {}) => {
  const {
    parts,
    filename,
    modelFileName,
    newFileName,
    thumbnailUrl,
    uploadedFile,
  } = model
  let primaryPart
  //This should be the the most common case for model cards
  if (filename) {
    if (filename.includes(THUMBNAILS_FOLDER)) {
      return filename
    } else {
      return `${THUMBNAILS_FOLDER}${filename}`
    }
  }
  if (thumbnailUrl) return `${THUMBNAILS_FOLDER}${thumbnailUrl}`
  //This is used by the Search By Model overlay for generating the "scanner" thumbnail
  if (uploadedFile) return `${THUMBNAILS_FOLDER}${uploadedFile}`
  if (modelFileName) return encodeURIComponent(modelFileName)
  if (parts) {
    if (parts.length > 1) {
      primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
    } else {
      primaryPart = parts[0]
    }
    return primaryPart.filename
  }
  //This is used by the model uploader to generate small thumbnails in the "Enter Part Info" overlay
  if (newFileName) {
    if (newFileName.includes(THUMBNAILS_FOLDER)) {
      return encodeURIComponent(newFileName)
    } else {
      return `${THUMBNAILS_FOLDER}${encodeURIComponent(newFileName)}`
    }
  }
  return 'unknown'
}

const ModelThumbnail = ({ className, model, name, mini, useThumbnailer = false }) => {
  const [loadingState, setLoadingState] = useState(LOADING)
  const onLoad = useCallback(() => setLoadingState(COMPLETE), [])
  const onError = useCallback(() => {
    setLoadingState(ERROR)
    track('Error - Thumbnail Image', { modelId: model && model.id })
  }, [model])
  const c = useStyles({ mini })
  const src = thumbnailUrl(model, useThumbnailer)

  return (
    <div className={classnames(className, c.ModelThumbnail)}>
      {loadingState === LOADING && <Loader className={c.ModelThumbnail_Loader} />}
      {src && (
        <img
          className={loadingState === ERROR ? c.ModelThumbnail_Error : undefined}
          src={src}
          alt={loadingState === ERROR ? '' : `${name} 3d model`}
          onLoad={onLoad}
          onError={onError}
          title={model.fileName}
        />
      )}
    </div>
  )
}

export default ModelThumbnail
