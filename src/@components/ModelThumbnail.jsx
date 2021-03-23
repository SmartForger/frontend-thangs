import React, { useCallback, useState } from 'react'
import ErrorImg from '@svg/image-loading-icon.svg'
import { Loader } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { buildThumbnailUrl, track } from '@utilities'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xxl },
  } = theme
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
          backgroundSize: ({ mini }) => (mini ? 'contain' : 'auto'),
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
          content: '"Image Processing..."',
          display: ({ mini }) => (mini ? 'none' : 'block'),
          left: '50%',
          position: 'absolute',
          textAlign: 'center',
          top: '75.5%',
          transform: 'translateX(-50%) scale(1.15)',

          [xxl]: {
            top: '65.5%',
          },
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
    ModelThumbnail__error: {
      transform: 'none !important',
    },
    ModelThumbnail__hidden: {
      display: 'none !important',
    },
    ModelThumbnail__background: {
      position: 'absolute',
    },
  }
})

const LOADING = 'LOADING'
const COMPLETE = 'COMPLETE'
const ERROR = 'ERROR'

const ModelThumbnail = ({
  className,
  showFallback = true,
  lazyLoad = false,
  showLoader = true,
  mini,
  model,
  name,
  useThumbnailer = false,
}) => {
  const [loadingState, setLoadingState] = useState(LOADING)
  const onLoad = useCallback(() => setLoadingState(COMPLETE), [])
  const onError = useCallback(() => {
    setLoadingState(ERROR)
    track('Error - Thumbnail Image', { modelId: model && model.id })
  }, [model])
  const c = useStyles({ mini })
  const src = buildThumbnailUrl(model, useThumbnailer)
  const showImg = showFallback || loadingState === COMPLETE
  return (
    <div
      className={classnames(className, c.ModelThumbnail, {
        [c.ModelThumbnail__background]: !showFallback,
      })}
    >
      {loadingState === LOADING && showLoader && (
        <Loader className={c.ModelThumbnail_Loader} />
      )}
      {src && (
        <img
          className={classnames({
            [c.ModelThumbnail__error]: loadingState === ERROR,
            [c.ModelThumbnail__hidden]: !showImg,
          })}
          src={src}
          alt={loadingState === ERROR ? '' : `${name} 3d model`}
          onLoad={onLoad}
          onError={onError}
          title={model.modelFileName || model.fileName}
          loading={lazyLoad ? 'lazy' : 'auto'}
        />
      )}
    </div>
  )
}

export default ModelThumbnail
