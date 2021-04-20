import React, { useEffect } from 'react'
import { Button, Spacer } from '@components'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'

const noop = () => null

const useStyles = createUseStyles(() => {
  return {
    Error_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    Error_ButtonSpacer: {
      flex: 'none',
    }
  }
})

const Submitted = ({
  onCancel = noop,
  onRetry = noop,
}) => {
  const c = useStyles()

  useEffect(() => {
    overlayview('AttachmentUpload - Error')
  }, [])

  return (
    <>
      <Spacer size={'1rem'} />
      <Title headerLevel={HeaderLevel.tertiary}>
        Photo submit failed
      </Title>
      <Spacer size={'0.75rem'} />
      <Body multiline>
        Something went wrong and we couldn't submit your model photos. Please try again.
      </Body>
      <Spacer size={'3rem'} />
      <div className={c.Error_ButtonWrapper}>
        <Button tertiary onClick={onCancel}>
          Cancel
        </Button>
        <Spacer size={'1rem'} className={c.Error_ButtonSpacer} />
        <Button onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </>
  )
}

export default Submitted
