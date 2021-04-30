import React, { useEffect } from 'react'
import { Button, Spacer } from '@components'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'
import { ReactComponent as SuccessCouch } from '@svg/success-couch-illustration.svg'
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

const Submitted = ({ onClose = noop }) => {
  const c = useStyles()

  useEffect(() => {
    overlayview('AttachmentUpload - Submitted')
  }, [])

  return (
    <>
      <Spacer size={'2rem'} />
      <div className={c.Submitted_IllustrationWrapper}>
        <SuccessCouch />
      </div>
      <Spacer size={'2rem'} />
      <Title headerLevel={HeaderLevel.tertiary}>Your photos have been submitted!</Title>
      <Spacer size={'0.75rem'} />
      <Body multiline>
        Your photos are being processed and will appear on the model&apos;s page when they
        have been approved.
      </Body>
      <Spacer size={'1.5rem'} />
      <div className={c.Submitted_ButtonWrapper}>
        <Button onClick={onClose}>Close</Button>
      </div>
    </>
  )
}

export default Submitted
