import React, { useState, useRef, useCallback } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import ReactModal from 'react-modal'
import md5 from 'md5'
import { logger } from '@utilities/logging'
import { Button, Pill } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    ChangeablePicture: {},
    ChangeablePicture_HiddenInput: {
      position: 'absolute',
      left: '0',
      top: '0',
      opacity: '0',
      height: '100%',
      width: '100%',
      cursor: 'pointer',
    },
    ChangeablePicture_Modal: {
      position: 'fixed',
      background: 'rgb(255, 255, 255)',
      border: '1px solid rgb(204, 204, 204)',
      overflow: 'auto',
      borderRadius: '4px',
      outline: 'none',
      padding: '1.25rem',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    ChangeablePicture_Form: {
      position: 'relative',
      '& g': {
        fill: theme.colors.black[500],
      },
    },
    ChangeablePicture_ButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '.5rem',
    },
    ChangeablePicture_CancelButton: {
      padding: '.5rem 2.25rem',
    },
    ChangeablePicture_SaveButton: {
      marginRight: '.5rem',
      padding: '.5rem 2.25rem',
    },
  }
})

ReactModal.setAppElement('#root')

const useModalOverlayStyles = createUseStyles(_theme => {
  return {
    '@global': {
      '.img-cropper-modal-overlay': {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 2,
      },
      '.ReactCrop__image': {
        maxHeight: '80vh',
        maxWidth: '80vw',
      },
    },
  }
})

const ModalOverlayStyles = () => {
  useModalOverlayStyles()

  return null
}

const initialCrop = { unit: '%', width: 30, aspect: 1 / 1 }

const ChangeablePicture = ({ className }) => {
  const [cropSrc, setCropSrc] = useState(null)
  const [crop, setCrop] = useState()
  const [croppedImg, setCroppedImg] = useState(null)
  const [img, setImg] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const imageEl = useRef(null)
  const formRef = useRef(null)
  const { dispatch } = useStoreon('userUploadAvatar')
  const c = useStyles()

  const submitCrop = useCallback(() => {
    dispatch(types.UPLOAD_USER_AVATAR, { file: croppedImg })
    setIsCropping(false)
  }, [croppedImg, dispatch])

  const cancel = useCallback(() => {
    formRef.current.reset()
    setIsCropping(false)
  }, [])

  const onSelectFile = useCallback(e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setCropSrc(reader.result)
        setIsCropping(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }, [])

  const onImageLoaded = useCallback(img => {
    setCrop(initialCrop)
    setImg(img)
    return false
  }, [])

  const onCropChange = useCallback(crop => setCrop(crop), [])

  const getCroppedImage = useCallback((image, crop, fileName) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, _reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          logger.error('Canvas is empty')
          return
        }
        blob.name = fileName
        resolve(blob)
      })
    }, 'image/jpeg')
  }, [])

  const makeClientCrop = useCallback(
    async crop => {
      if (img && crop.width && crop.height) {
        const croppedImg = await getCroppedImage(
          img,
          crop,
          md5(imageEl.current.files[0].name)
        )
        setCroppedImg(croppedImg)
      }
    },
    [getCroppedImage, img]
  )

  const onCropComplete = useCallback(
    async crop => {
      await makeClientCrop(crop)
    },
    [makeClientCrop]
  )

  return (
    <form className={classnames(className, c.ChangeablePicture_Form)} ref={formRef}>
      <label htmlFor='avatar'>
        <Pill
          className={c.ChangeablePicture_UploadButton}
          onClick={e => {
            e.preventDefault()
          }}
        >
          Upload New Image
        </Pill>
      </label>
      <input
        className={c.ChangeablePicture_HiddenInput}
        type='file'
        name='Change Image'
        id='avatar'
        onChange={onSelectFile}
        accept='image/x-png,image/jpeg'
        ref={imageEl}
      />
      <ModalOverlayStyles />
      <ReactModal
        className={c.ChangeablePicture_Modal}
        isOpen={isCropping}
        overlayClassName='img-cropper-modal-overlay'
      >
        <ReactCrop
          src={cropSrc}
          crop={crop}
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
          circularCrop={true}
        />
        <div className={c.ChangeablePicture_ButtonContainer}>
          <Button secondary className={c.ChangeablePicture_CancelButton} onClick={cancel}>
            Cancel
          </Button>
          <Button onClick={submitCrop} className={c.ChangeablePicture_SaveButton}>
            Save
          </Button>
        </div>
      </ReactModal>
    </form>
  )
}

export default ChangeablePicture
