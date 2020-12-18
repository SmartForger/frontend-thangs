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
        },

        '&:after': {
          content: '"Image Unavailable"',
          position: 'absolute',
          display: 'block',
          top: '72.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        },
      },
    },
    ModelThumbnail_WaldoThumbnail: {
      position: 'absolute',
      right: '-.5rem',
      top: '-.5rem',
      zIndex: 1000,

      '& img': {
        width: '5rem',
        borderRadius: '.5rem',
        background: theme.colors.white[400],
        boxShadow: '-1px 2px 4px -1px rgba(0,0,0,0.79)',
      },
    },
    ModelThumbnail_Loader: {
      position: 'absolute',
    },
  }
})

const LOADING = 'LOADING'
const COMPLETE = 'COMPLETE'
const ERROR = 'ERROR'

const THUMBNAILS_HOST = process.env.REACT_APP_THUMBNAILS_HOST
const TIW_THUMBNAILS_HOST = process.env.REACT_APP_TIW_THUMBNAILS_HOST

const getThumbnailFileName = (model = {}) => {
  let primaryPart
  if (model.uploadedFile) return model.uploadedFile
  if (model.modelFileName) return model.modelFileName.replace('uploads/models/', '')
  if (model.parts) {
    if (model.parts.length > 1) {
      primaryPart = R.find(R.propEq('isPrimary', true))(model.parts)
      if (primaryPart.fileName) return primaryPart.fileName.replace('uploads/models/', '')
    } else {
      primaryPart = model.parts[0]
      return primaryPart.fileName.replace('uploads/models/', '')
    }
  }
  if (model.fileName) return model.fileName.replace('uploads/models/', '')
  return 'unknown'
}

const getWaldoThumbnailUrl = (model = {}, searchModelFileName) => {
  if (searchModelFileName) return searchModelFileName.replace('uploads/models/', '')
  if (model.searchModel) return model.searchModel.replace('uploads/models/', '')
}

const thumbnailUrl = model =>
  model.fullThumbnailUrl
    ? model.fullThumbnailUrl
    : model.thumbnailUrl
      ? model.thumbnailUrl
      : `${THUMBNAILS_HOST}/${getThumbnailUrl(model)}?size=456x540`

const getThumbnailUrl = (model = {}) => {
  let primaryPart
  if (model.thumbnailUrl) return model.thumbnailUrl
  if (model.uploadedFile) return model.uploadedFile
  if (model.modelFileName) return model.modelFileName.replace('uploads/models/', '')
  if (model.parts) {
    if (model.parts.length > 1) {
      primaryPart = R.find(R.propEq('isPrimary', true))(model.parts)
      if (primaryPart.fileName) return primaryPart.fileName.replace('uploads/models/', '')
    } else {
      primaryPart = model.parts[0]
      return primaryPart.fileName.replace('uploads/models/', '')
    }
  }
  if (model.fileName) return model.fileName.replace('uploads/models/', '')
  return 'unknown'
}

const waldoThumbnailUrl = (model, searchModelFileName) =>
  searchModelFileName
    ? `${TIW_THUMBNAILS_HOST}/${getThumbnailFileName(model)}/${getWaldoThumbnailUrl(
      model,
      searchModelFileName
    )}`
    : undefined

const ModelThumbnail = ({ className, model, name, searchModelFileName, showWaldo }) => {
  const [loadingState, setLoadingState] = useState(LOADING)
  const [lookingForWaldo, setLookingForWaldo] = useState(true)
  const [isSwapped, setIsSwapped] = useState(false)
  const onLoad = useCallback(() => setLoadingState(COMPLETE), [])
  const onError = useCallback(() => {
    setLoadingState(ERROR)
    track('Error - Thumbnail Image', { modelId: model && model.id })
  }, [model])
  const onFoundWaldo = useCallback(() => setLookingForWaldo(false), [])
  const c = useStyles()
  const onSwap = useCallback(() => {
    setIsSwapped(!isSwapped)
  }, [isSwapped])

  const src = thumbnailUrl(model)
  const waldoSrc = showWaldo ? waldoThumbnailUrl(model, searchModelFileName) : undefined

  return (
    <>
      <div
        className={classnames({
          [c.ModelThumbnail_WaldoThumbnail]: isSwapped,
          [className]: !isSwapped,
          [c.ModelThumbnail]: !isSwapped,
        })}
        onClick={loadingState === COMPLETE && !lookingForWaldo ? onSwap : undefined}
      >
        {loadingState === LOADING && <Loader className={c.ModelThumbnail_Loader} />}
        {src && (
          <img
            src={src}
            alt={`${name} 3d model`}
            onLoad={onLoad}
            onError={onError}
            title={model.fileName}
          />
        )}
      </div>
      {waldoSrc && (
        <div
          className={classnames({
            [c.ModelThumbnail_WaldoThumbnail]: !isSwapped,
            [className]: isSwapped,
            [c.ModelThumbnail]: isSwapped,
          })}
          onClick={loadingState === COMPLETE && !lookingForWaldo ? onSwap : undefined}
        >
          <img
            src={waldoSrc}
            onLoad={onFoundWaldo}
            onError={i => (i.target.style.display = 'none')}
            alt={`${name} 3d model`}
          />
          {/* {lookingForWaldo && <Loader />} */}
        </div>
      )}
    </>
  )
}

export default ModelThumbnail
