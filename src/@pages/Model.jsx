import React from 'react'
import { useHistory, Link, useParams } from 'react-router-dom'
import * as R from 'ramda'
import {
  Button,
  CommentsForModel,
  HoopsModelViewer,
  Layout,
  LikeModelButton,
  ModelDetails,
  ModelTitle,
  ModelViewer as BackupViewer,
  ProgressText,
  RelatedModels,
  Revised,
  Spinner,
  ToggleFollowButton,
  useFlashNotification,
} from '@components'
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg'
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/dropdown-heart.svg'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as DateIcon } from '@svg/date-icon.svg'
import { useLocalStorage } from '@hooks'
import { Message404 } from './404'
import { createUseStyles } from '@style'
import { useServices } from '@hooks'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { sm, md, lg, xl },
  } = theme
  return {
    Model: {
      width: '100%',
    },
    Model_Header: {
      display: 'flex',
      alignItems: 'center',
      margin: '.5rem 0 1rem',
    },
    Model_Row: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '2rem',
      '&:first-of-type': {
        marginTop: '1.5rem',
      },
    },
    Model_Column: {
      display: 'flex',
      flexDirection: 'column',

      [md]: {
        marginRight: '2rem',
        '&:last-of-type': {
          marginRight: 0,
        },
      },
    },
    Model_MainColumn: {
      width: '100%',
      maxWidth: '60rem',
      marginRight: '4rem',
    },
    Model_Row__mobile: {
      [lg]: {
        display: 'none',
      },
    },
    Model_Column__desktop: {
      display: 'none',
      [lg]: {
        display: 'block',
        maxWidth: '35%',
      },
    },
    Model_ModelViewer: {
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
      height: '23.5rem',
      margin: '0 auto',
      width: '100%',

      [sm]: {
        height: '28.75rem',
      },

      [md]: {
        height: '37.5rem',
      },

      [lg]: {
        height: '38.5rem',
      },

      [xl]: {
        height: '38.5rem',
      },
    },
    Model_ModelDescription: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    Model_ModelDetails: {
      marginTop: '2rem',
    },
    Model_Detail: {
      justifyContent: 'space-between',
    },
    Model_SocialButtons: {
      display: 'flex',
      alignItems: 'center',

      '& > div': {
        marginLeft: '1rem',
      },
    },
    Model_BackupViewer: {
      height: '38.5rem',
    },
    Model_TitleContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: '.5rem 0',
    },
    Model_TitleContent: {
      flexDirection: 'column',
    },
    Model_OwnerProfilePicture: {
      marginRight: '1rem',
    },
    Model_ProfileLink: {
      ...theme.mixins.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
    Model_DownloadButton: {
      width: '100%',
    },
    Model_ModelStats: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '1.5rem',

      '& > span': {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500,
        marginBottom: '.5rem',
        '&:last-of-type': {
          marginBottom: 0,
        },
      },

      '& svg': {
        marginRight: '.5rem',
      },

      '& svg, & path': {
        fill: theme.colors.gold[500],
        stroke: theme.colors.gold[500],
      },
    },
    Model_VersionHeader: {
      ...theme.mixins.text.formCalloutText,
      marginBottom: '1.5rem',
    },
    Model_VersionLinkText: {
      ...theme.mixins.text.linkText,
    },
    Model_VersionButton: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.5rem',
      marginBottom: '1rem',
      cursor: 'pointer',

      '& *:not(:first-child)': {
        marginLeft: '.75rem',
      },

      '& path, & polygon': {
        fill: theme.colors.blue[500],
      },
    },
    Model_VersionIcon: {
      width: '1.25rem',
      height: '1.25rem',
    },
    Model_RevisedLabel: {
      display: 'flex',
      marginBottom: '1.5rem',
      alignItems: 'center',

      '& *:not(:first-child)': {
        marginLeft: '.25rem',
      },

      '& path, & polygon': {
        fill: theme.colors.grey[700],
      },
    },
    Model_Rule: {
      margin: '2rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.white[900]}`,
    },
  }
})

const DownloadLink = ({ model }) => {
  const c = useStyles()
  const { dispatch, modelDownloadUrl } = useStoreon('modelDownloadUrl')
  const downloadModel = () =>
    dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
      modelId: model.id,
      onFinish: downloadUrl => {
        window.open(downloadUrl)
      },
    })
  return (
    <Button className={c.Model_DownloadButton} onClick={downloadModel}>
      {modelDownloadUrl.isLoading ? (
        <ProgressText text='Downloading' />
      ) : modelDownloadUrl.isError ? (
        'Server Error'
      ) : (
        'Download Model'
      )}
    </Button>
  )
}

const ModelStats = ({ model: _m }) => {
  const c = useStyles()
  return (
    <div className={c.Model_ModelStats}>
      <span>
        <HeartIcon width={12} height={12} />
        143 Likes
      </span>
      <span>
        <DownloadIcon width={12} height={12} />
        4321 Downloads
      </span>
      <span>
        <DateIcon width={12} height={12} />
        April 29, 2020
      </span>
    </div>
  )
}

const VersionUpload = ({ modelId }) => {
  const c = useStyles()
  return (
    <div>
      <h2 className={c.Model_VersionHeader}>Versions</h2>
      <Link to={`/model/${modelId}/upload`}>
        <div className={c.Model_VersionButton}>
          <VersionIcon className={c.Model_VersionIcon} />
          <Button text className={c.Model_VersionLinkText}>
            Upload new version
          </Button>
        </div>
      </Link>
    </div>
  )
}

const Details = ({ currentUser, model }) => {
  const c = useStyles()
  return (
    <div className={classnames(c.Model_Row, c.Model_Detail)}>
      <ModelTitle model={model} />
      {model.previousVersionModelId && <Revised modelId={model.previousVersionModelId} />}
      {model.id && (
        <div className={c.Model_SocialButtons}>
          <div>
            <ToggleFollowButton userId={currentUser.id} />
          </div>
          <div>
            <LikeModelButton currentUser={currentUser} modelId={model.id} model={model} />
          </div>
        </div>
      )}
    </div>
  )
}

const ModelDetailPage = ({ id, currentUser, showBackupViewer }) => {
  const c = useStyles()
  const history = useHistory()
  const { navigateWithFlash } = useFlashNotification()
  const isFromThePortal = () =>
    history.location && history.location.state && history.location.state.prevPath
  const { useFetchOnce } = useServices()
  const {
    atom: { data: modelData, isLoading, isLoaded, isError },
  } = useFetchOnce(id, 'model')

  if (isLoading || !isLoaded) {
    return <Spinner />
  } else if (R.isEmpty(modelData)) {
    navigateWithFlash('/home', 'The model entered does not exist')
  } else if (!modelData) {
    return <Message404 />
  } else if (isError) {
    return <div>Error loading Model</div>
  }

  return (
    <div className={c.Model}>
      {isFromThePortal() ? (
        <div className={c.Model_Header}>
          <Button back onClick={() => history.goBack()}>
            <BackArrow />
          </Button>
        </div>
      ) : null}
      <div className={c.Model_Column}>
        <Details currentUser={currentUser} model={modelData} />
        <div className={c.Model_Row}>
          {showBackupViewer ? (
            <BackupViewer className={c.Model_BackupViewer} model={modelData} />
          ) : (
            <HoopsModelViewer className={c.Model_ModelViewer} model={modelData} />
          )}
        </div>
        <div className={c.Model_Row}>
          <div className={c.Model_MainColumn}>
            <div>
              <div className={c.Model_ModelDescription}>{modelData.description}</div>
              <div className={c.Model_ModelDetails}>
                <ModelDetails model={modelData} />
              </div>
              <hr className={c.Model_Rule} />
            </div>
            <CommentsForModel model={modelData} />
          </div>
          <div className={c.Model_Column}>
            <div>
              <DownloadLink model={modelData} />
              <ModelStats model={modelData} />
            </div>
            <hr className={c.Model_Rule} />
            <VersionUpload modelId={modelData.id} />
            <hr className={c.Model_Rule} />
            <RelatedModels modelId={modelData.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const { id } = useParams()
  const [showBackupViewer] = useLocalStorage('showBackupViewer', false)
  const [currentUser] = useLocalStorage('currentUser', null)

  return (
    <ModelDetailPage
      id={id}
      currentUser={currentUser}
      showBackupViewer={showBackupViewer}
    />
  )
}

const ModelDetail = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default ModelDetail
