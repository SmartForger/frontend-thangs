import React, { useCallback, useState } from 'react'
import ErrorImg from '@svg/image-error-icon.svg'
import { ReactComponent as LoadingIcon } from '@svg/icon-loader.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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
      ...theme.mixins.text.thumbnailErrorText,
      position: 'relative',
      height: '100%',
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
        width: '5rem',
      },

      '& img': {
        margin: 'auto',
        display: 'block',
        maxWidth: 'calc(100% - 1.5rem)',
        zIndex: 1,
        height: 'auto',

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
          content: '"Image Error"',
          position: 'absolute',
          display: 'block',
          top: '72.5%',
          left: '50%',
          transform: 'translateX(-50%)',
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
    Spinner: {
      animation: '$spin 1.2s linear infinite',
    },
  }
})

const LOADING = 'LOADING'
const COMPLETE = 'COMPLETE'
const ERROR = 'ERROR'

const ModelThumbnail = ({
  className,
  model,
  name,
  thumbnailUrl: src,
  waldoThumbnailUrl: waldoSrc = undefined,
}) => {
  const [loadingState, setLoadingState] = useState(LOADING)
  const [lookingForWaldo, setLookingForWaldo] = useState(true)
  const [isSwapped, setIsSwapped] = useState(false)
  const onLoad = useCallback(() => setLoadingState(COMPLETE), [])
  const onError = useCallback(() => setLoadingState(ERROR), [])
  const onFoundWaldo = useCallback(() => setLookingForWaldo(false), [])
  const c = useStyles()
  const onSwap = useCallback(() => {
    setIsSwapped(!isSwapped)
  }, [isSwapped])
  return (
    <>
      <div
        className={classnames({
          [c.ModelThumbnail_WaldoThumbnail]: isSwapped,
          [className]: !isSwapped,
          [c.ModelThumbnail]: !isSwapped,
        })}
        onClick={onSwap}
      >
        {src && (
          <img
            src={src}
            alt={name}
            onLoad={onLoad}
            onError={onError}
            title={model.fileName}
          />
        )}
        {loadingState === LOADING && <LoadingIcon className={c.Spinner} />}
      </div>
      {waldoSrc && (
        <div
          className={classnames({
            [c.ModelThumbnail_WaldoThumbnail]: !isSwapped,
            [className]: isSwapped,
            [c.ModelThumbnail]: isSwapped,
          })}
          onClick={onSwap}
        >
          <img
            src={waldoSrc}
            onLoad={onFoundWaldo}
            onError={i => (i.target.style.display = 'none')}
          />
          {lookingForWaldo && <LoadingIcon className={c.Spinner} />}
        </div>
      )}
    </>
  )
}

export default ModelThumbnail
