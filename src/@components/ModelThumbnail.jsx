import React, { useCallback, useState } from 'react'
import * as R from 'ramda'
import ErrorImg from '@svg/image-error-icon.svg'
import { Loader } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { track } from '@utilities/analytics'

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
      position: 'relative',
      overflow: 'hidden',
      padding: '1rem .5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

      '& > svg': {
        display: 'block',
        position: 'absolute',
        height: '100%',
        width: '2rem',
      },

      '& img': {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        transform: 'scale(.85)',

        '&:before': {
          content: '""',
          display: 'block',
          backgroundColor: theme.variables.colors.cardBackground,
          backgroundImage: `url(${ErrorImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 37%',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          transform: 'scale(1.15)',
        },

        '&:after': {
          content: '"Image Unavailable"',
          position: 'absolute',
          display: 'block',
          top: '72.5%',
          left: '50%',
          transform: 'translateX(-50%) scale(1.15)',
          textAlign: 'center',
        },
      },
    },
    ModelThumbnail_Loader: {
      position: 'absolute',
    },
    ModelThumbnail_Error: {
      transform: 'none !important',
    },
  }
})

const LOADING = 'LOADING'
const COMPLETE = 'COMPLETE'
const ERROR = 'ERROR'

const THUMBNAILS_HOST = process.env.REACT_APP_THUMBNAILS_HOST
const THUMBNAILS_FOLDER = process.env.REACT_APP_THUMBNAILS_FOLDER

const thumbnailUrl = model =>
  model.fullThumbnailUrl
    ? model.fullThumbnailUrl
    : model.thumbnailUrl
    ? model.thumbnailUrl
    : `${THUMBNAILS_HOST}${getThumbnailUrl(model)}size=456x540`

const getThumbnailUrl = (model = {}) => {
  const {
    parts,
    compositeMesh,
    filename,
    modelFileName,
    newFileName,
    thumbnailUrl,
    uploadedFile,
  } = model
  let primaryPart
  if (thumbnailUrl) return `${THUMBNAILS_FOLDER}${thumbnailUrl}?`
  if (uploadedFile) return `${THUMBNAILS_FOLDER}${uploadedFile}?`
  if (modelFileName)
    return `${THUMBNAILS_FOLDER}${modelFileName.replace(`${THUMBNAILS_FOLDER}`, '')}?`
  if (compositeMesh) {
    const [meshFolder, ...compositeModel] = compositeMesh.split('/')
    return `${compositeModel.join('%2F')}?source=${meshFolder}&`
  }
  if (filename) {
    return `${encodeURIComponent(filename)}?`
  }
  if (parts) {
    if (parts.length > 1) {
      primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
    } else {
      primaryPart = parts[0]
    }
    if (primaryPart.compositeMesh) {
      const [meshFolder, ...compositeModel] = primaryPart.compositeMesh.split('/')
      return `${compositeModel.join('%2F')}?source=${meshFolder}&`
    } else {
      return `${THUMBNAILS_FOLDER}${encodeURIComponent(`${primaryPart.filename}`)}?`
    }
  }
  if (newFileName) return `${encodeURIComponent(newFileName)}?`
  return 'unknown'
}

const ModelThumbnail = ({ className, model, name }) => {
  const [loadingState, setLoadingState] = useState(LOADING)
  const onLoad = useCallback(() => setLoadingState(COMPLETE), [])
  const onError = useCallback(() => {
    setLoadingState(ERROR)
    track('Error - Thumbnail Image', { modelId: model && model.id })
  }, [model])
  const c = useStyles()
  const src = thumbnailUrl(model)

  return (
    <div className={classnames(className, c.ModelThumbnail)}>
      {loadingState === LOADING && <Loader className={c.ModelThumbnail_Loader} />}
      {src && (
        <img
          className={loadingState === ERROR ? c.ModelThumbnail_Error : undefined}
          src={src}
          alt={`${name} 3d model`}
          onLoad={onLoad}
          onError={onError}
          title={model.fileName}
        />
      )}
    </div>
  )
}

export default ModelThumbnail
