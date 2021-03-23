import React, { useCallback, useEffect } from 'react'
import {
  Button,
  Divider,
  ModelTitle,
  SingleLineBodyText,
  Spacer,
  Spinner,
  TitleTertiary,
} from '@components'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { createUseStyles } from '@physna/voxel-ui'
import classnames from 'classnames'
import { overlayview, track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import * as types from '@constants/storeEventTypes'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    License: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
      width: '100%',

      [md]: {
        borderRadius: '1rem',
        alignItems: 'stretch',
        flexDirection: 'row',
        width: 'unset',
      },

      '& > div': {
        alignItems: 'flex-start',
      },
    },
    License_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    License_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',

      [md]: {
        borderRadius: '1rem',
      },
    },
    License_LicenseForm: {
      backgroundColor: theme.colors.white[300],
      borderRadius: '0 0 1rem 1rem',

      [md]: {
        borderRadius: 0,
      },
    },
    License_FormWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: '1rem',

      [md]: {
        minWidth: '21.875rem',
        maxWidth: '28.875rem',
      },
    },
    License_Form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    License_TextContainer: {
      ...theme.mixins.scrollbar,
      backgroundColor: '#F7F7FB',
      borderRadius: '1rem',
      display: 'flex',
      height: 'auto',
      maxHeight: '30rem',
      overflowX: 'hidden',
      overflowY: 'auto',
      width: '100%',

      '&::-webkit-scrollbar-track': {
        background: '#F7F7FB',
      },
    },
    License_Text: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '0 1rem',
      whiteSpace: 'break-spaces',
      width: '100%',
    },
    License_ConfirmButton: {
      marginBottom: '2rem',
      width: '100%',
    },
    License_MobileSpacer: {
      [md]: {
        display: 'none',
      },
    },
    License_ExitButton: {
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      zIndex: '4',
      cursor: 'pointer',

      '& path': {
        fill: theme.colors.black[500],
      },
    },
    License_Header: {
      position: 'absolute',
      marginLeft: 'auto',
      marginRight: 'auto',
      left: '0',
      right: '0',
      top: '2rem',
      textAlign: 'center',
    },
    License_Title: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    License_Download: {
      cursor: 'pointer',
    },
  }
})

const LicenseContent = ({ c, model }) => {
  const { setOverlayOpen } = useOverlay()
  const { dispatch, license } = useStoreon('license')
  const licenseText = R.path(['data', 'licenseText'], license)
  useEffect(() => {
    dispatch(types.FETCH_MODEL_LICENSE, {
      modelId: model.id,
    })
    // eslint-disable-next-line
  }, [])

  const closeLicenseOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleDownload = () => {
    dispatch(types.FETCH_LICENSE_DOWNLOAD_URL, {
      id: model.id,
      onFinish: downloadUrl => {
        window.location.assign(downloadUrl)
        track('Download License', { modelId: model.id })
      },
    })
  }

  return (
    <div className={classnames(c.License_Row, c.License_LicenseForm)}>
      <Spacer size='2rem' />
      <div className={c.License_FormWrapper}>
        <Spacer size='4rem' />
        <div className={c.License_Title}>
          <TitleTertiary>Creative Commons License</TitleTertiary>
          <div onClick={handleDownload} className={c.License_Download}>
            <DownloadIcon width={12} height={12} />
            &nbsp;Download
          </div>
        </div>
        <Divider spacing={'1rem'} />
        <ModelTitle closeOverlay={closeLicenseOverlay} model={model} />
        <Divider spacing={'1rem'} />
        <Spacer size='.5rem' />
        {license.isLoading && !license.isLoaded && <Spinner />}
        {license.isLoaded && licenseText && (
          <div className={c.License_TextContainer}>
            <pre className={c.License_Text}>{license.data.licenseText}</pre>
          </div>
        )}
        <Spacer size='1.5rem' />
        <Button onClick={closeLicenseOverlay} className={c.License_ConfirmButton}>
          Close
        </Button>
      </div>
      <Spacer size='2rem' />
    </div>
  )
}

const License = ({ model }) => {
  const c = useStyles({})
  const { setOverlayData, setOverlayOpen } = useOverlay()

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  useEffect(() => {
    overlayview('license')
  }, [])

  return (
    <div className={c.License}>
      <ExitIcon className={c.License_ExitButton} onClick={closeOverlay} />
      <SingleLineBodyText className={c.License_Header}>Model license</SingleLineBodyText>
      <LicenseContent c={c} model={model} setOverlayData={setOverlayData} />
      <Spacer className={c.License_MobileSpacer} width='4rem' height='unset' />
    </div>
  )
}

export default License
