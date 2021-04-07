import React, { useEffect, useMemo } from 'react'
import {
  Button,
  Spacer,
  Textarea,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(() => {
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
  numOfAttachments,
  onBack = noop,
  onCancel = noop,
  onContinue = noop,
  onInputChange = noop,
  onSubmit = noop,
}) => {
  const c = useStyles()

  useEffect(() => {
    overlayview('AttachmentUpload - Attachment')
  }, [])

  const isFirstAttachment = useMemo(() => {
    return attachment.position === 0
  }, [attachment])
  const isLastAttachment = useMemo(() => {
    return (attachment.position + 1) === numOfAttachments
  }, [attachment, numOfAttachments])
  const imageUrl = useMemo(() => URL.createObjectURL(attachment.file), [attachment.file])

  return (
    <>
      <img src={imageUrl} className={c.Attachment_Image} alt="photo preview" />
      <Spacer size={'1rem'} />
      <Textarea
        name='caption'
        label='Caption'
        value={attachment.caption}
        onChange={onInputChange}
      />
      <Spacer size={'1.5rem'} />
      <div className={c.Attachment_ButtonWrapper}>
        <Button secondary onClick={onCancel}>
          Cancel
        </Button>
        <Spacer size={'1rem'} className={c.Attachment_ButtonSpacer} />
        {isLastAttachment ? (
          <Button onClick={onSubmit}>
            Submit
          </Button>
        ) : (
          <Button onClick={onContinue}>
            Continue
          </Button>
        )}
      </div>
    </>
  )
}

export default Attachment
