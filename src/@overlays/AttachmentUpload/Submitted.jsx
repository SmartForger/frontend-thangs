import React, { useEffect } from 'react'
import {
  Button,
  MultiLineBodyText,
  Spacer,
  TitleTertiary
} from '@components'
import { ReactComponent as PhotosSubmitted } from '@svg/photos-submitted.svg'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'

const noop = () => null

const useStyles = createUseStyles(() => {
  return {
    Submitted_IllustrationWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    Submitted_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
  }
})

const Submitted = ({
  onClose = noop,
}) => {
  const c = useStyles()

  useEffect(() => {
    overlayview('AttachmentUpload - Submitted')
  }, [])

  return (
    <>
      <Spacer size={'2rem'} />
      <div className={c.Submitted_IllustrationWrapper}>
        <PhotosSubmitted />
      </div>
      <Spacer size={'2rem'} />
      <TitleTertiary>
        Your photos have been submitted!
      </TitleTertiary>
      <Spacer size={'0.75rem'} />
      <MultiLineBodyText>
        Thank you for being a part of the Thangs community. Your photos are
        being processed and will appear on the model's page when they have
        been approved.
      </MultiLineBodyText>
      <Spacer size={'1.5rem'} />
      <div className={c.Submitted_ButtonWrapper}>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  )
}

export default Submitted
