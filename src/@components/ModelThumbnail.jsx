import React, { useState } from 'react'
import ErrorImg from '@svg/image-error-icon.svg'
import { ReactComponent as LoadingIcon } from '@svg/image-loading-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelThumbnail: {
      ...theme.mixins.text.thumbnailErrorText,
      position: 'relative',
      height: '100%',
      overflow: 'hidden',
      padding: '.5rem',
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
    },
    ModelThumbnail_Image: {
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
  }
})

const LOADING = 'LOADING'
const COMPLETE = 'COMPLETE'
const ERROR = 'ERROR'

export function ModelThumbnail({ name, thumbnailUrl: src, className }) {
  const [loadingState, setLoadingState] = useState(LOADING)
  const onLoad = () => setLoadingState(COMPLETE)
  const onError = () => setLoadingState(ERROR)
  const c = useStyles()
  return (
    <div className={classnames(className, c.ModelThumbnail)}>
      {src && (
        <img
          className={c.ModelThumbnail_Image}
          src={src}
          alt={name}
          onLoad={onLoad}
          onError={onError}
        />
      )}
      {loadingState === LOADING && <LoadingIcon />}
    </div>
  )
}
