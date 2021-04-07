import React, { useEffect } from 'react'
import {
  Button,
  MultiLineBodyText,
  Spacer,
  TitleTertiary,
} from '@components'
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
      <TitleTertiary>
        Photo submit failed
      </TitleTertiary>
      <Spacer size={'0.75rem'} />
      <MultiLineBodyText>
        Something went wrong and we couldn't submit your model photos. Please try again.
      </MultiLineBodyText>
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
