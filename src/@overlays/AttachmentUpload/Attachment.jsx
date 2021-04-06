import React, { useEffect, useState } from 'react'
import {
  Button,
  Spacer,
  Spinner,
  Textarea,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    Attachment_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    Attachment_ButtonSpacer: {
      flex: 'none',
    },
    Attachment_Image: {
      borderRadius: '12px',
    },
  }
})

const noop = () => null
const Attachment = ({
  attachment,
  activeAttachmentIndex,
  fileData,
  onCancel = noop,
  onContinue = noop,
}) => {
  const c = useStyles({ hasFile: true })

  const [caption, setCaption] = useState('')

  useEffect(() => {
    overlayview('AttachmentUpload - Attachment')
  }, [])

  const onCaptionInputChange = (_, newValue) => {
    setCaption(newValue)
  }

  return (
    <>
      <img src={URL.createObjectURL(fileData[activeAttachmentIndex].file)} className={c.Attachment_Image} />
      <Spacer size={'1rem'} />
      <Textarea
        name='caption'
        label='Caption'
        value={caption}
        onChange={onCaptionInputChange}
      />
      <Spacer size={'1.5rem'} />
      <div className={c.Attachment_ButtonWrapper}>
        <Button secondary onClick={onCancel}>
          Cancel
        </Button>
        <Spacer size={'1rem'} className={c.Attachment_ButtonSpacer} />
        <Button onClick={onContinue}>
          Continue
        </Button>
      </div>
    </>
  )
}

export default Attachment
