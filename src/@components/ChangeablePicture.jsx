import React, { useState, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Modal from 'react-modal'
import md5 from 'md5'

import { logger } from '@utilities/logging'

import { Button } from '@components'
import * as GraphqlService from '@services/graphql-service'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
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
      marginRight: '.5rem',
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
    ChangeablePicture_UploadButton: {
      width: '12.25rem',
      maxWidth: '100%',
    },
  }
})

Modal.setAppElement('#root')

const graphqlService = GraphqlService.getInstance()

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

export function ChangeablePicture({ user, _button, className }) {
  const [cropSrc, setCropSrc] = useState(null)
  const [crop, setCrop] = useState()
  const [croppedImg, setCroppedImg] = useState(null)
  const [img, setImg] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const imageEl = useRef(null)
  const formRef = useRef(null)
  const buttonRef = useRef(null)
  const [uploadAvatar] = graphqlService.useUploadUserAvatarMutation(user, croppedImg)
  const c = useStyles()

  const submitCrop = () => {
    uploadAvatar()
    setIsCropping(false)
  }

  const cancel = () => {
    formRef.current.reset()
    setIsCropping(false)
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setCropSrc(reader.result)
        setIsCropping(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoaded = img => {
    setCrop(initialCrop)
    setImg(img)
    return false
  }

  const onCropComplete = async crop => {
    await makeClientCrop(crop)
  }

  const onCropChange = crop => setCrop(crop)

  async function makeClientCrop(crop) {
    if (img && crop.width && crop.height) {
      const croppedImg = await getCroppedImage(
        img,
        crop,
        md5(imageEl.current.files[0].name)
      )
      setCroppedImg(croppedImg)
    }
  }

  const getCroppedImage = (image, crop, fileName) => {
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
  }

  // const onButtonClick = e => {
  //   buttonRef.current.focus()
  //   e.persist()
  // }

  return (
    <form className={classnames(className, c.ChangeablePicture_Form)} ref={formRef}>
      <label htmlFor='avatar'>
        <Button
          className={c.ChangeablePicture_UploadButton}
          onClick={e => {
            e.preventDefault()
          }}
          ref={buttonRef}
        >
          Upload New Photo
        </Button>
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
      <Modal
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
          <Button onClick={submitCrop} className={c.ChangeablePicture_SaveButton}>
            Save
          </Button>
          <Button dark className={c.ChangeablePicture_CancelButton} onClick={cancel}>
            Cancel
          </Button>
        </div>
      </Modal>
    </form>
  )
}
