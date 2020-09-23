import React, { useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as R from 'ramda'
import { format } from 'date-fns'
import {
  Button,
  CommentsForModel,
  Divider,
  HoopsModelViewer,
  Layout,
  LikeModelButton,
  ModelDetails,
  ModelTitle,
  ModelViewer as BackupViewer,
  ProgressText,
  RelatedModels,
  Revised,
  Spacer,
  Spinner,
  ToggleFollowButton,
  useFlashNotification,
} from '@components'
import { ReactComponent as HeartIcon } from '@svg/dropdown-heart.svg'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as DateIcon } from '@svg/date-icon.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { useLocalStorage } from '@hooks'
import { Message404 } from './404'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { usePageMeta, useServices } from '@hooks'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { sm, md, lg, xl },
  } = theme
  return {
    Model: {
      width: '100%',
      maxWidth: '76.5rem',
      margin: '0 auto',
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
    Model_LeftColumn: {
      flexBasis: '2rem',
      flexGrow: 2,
      maxWidth: '60rem',

      [md]: {
        marginRight: '4rem',
      },
    },
    Model_RightColumn: {
      flexBasis: '1rem',
      flexGrow: 1,
    },
    Model__mobileOnly: {
      [md]: {
        display: 'none',
      },
    },
    Model__desktopOnly: {
      display: 'none',
      [md]: {
        display: 'block',
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
      flexDirection: 'column',

      [md]: {
        flexDirection: 'row',
      },
    },
    Model_SocialButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: '1rem',

      '& > div': {
        marginLeft: '1rem',
      },

      [md]: {
        marginTop: 0,
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
      ...theme.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
    Model_SidebarButton: {
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
      ...theme.text.formCalloutText,
      marginBottom: '1.5rem',
    },
    Model_VersionButton: {
      '& path, & polygon': {
        fill: theme.colors.black[500],
        stroke: theme.colors.black[500],
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
const noop = () => null
const DownloadLink = ({ model, isAuthedUser, openSignupOverlay = noop }) => {
  const c = useStyles()
  const { dispatch, modelDownloadUrl } = useStoreon('modelDownloadUrl')
  const downloadModel = useCallback(
    () =>
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        modelId: model.id,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
          pendo.track('Download Model', { modelId: model.id })
        },
      }),
    [dispatch, model.id]
  )

  const handleClick = useCallback(() => {
    if (isAuthedUser) {
      downloadModel()
    } else {
      openSignupOverlay('Join to download.', 'Download')
      pendo.track('SignUp Prompt Overlay', { source: 'Download' })
    }
  }, [downloadModel, isAuthedUser, openSignupOverlay])

  return (
    <Button className={c.Model_SidebarButton} onClick={handleClick}>
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

const ModelStats = ({ model = {} }) => {
  const c = useStyles()
  return (
    <div className={c.Model_ModelStats}>
      <span>
        <HeartIcon width={12} height={12} />
        {model.likesCount} likes
      </span>
      <span>
        <DownloadIcon width={12} height={12} />
        {model.downloadCount} Downloads
      </span>
      <span>
        <DateIcon width={12} height={12} />
        {model.uploadDate && format(new Date(model.uploadDate), 'MMMM d, Y')}
      </span>
    </div>
  )
}

const VersionLink = ({ modelId, isAuthedUser, openSignupOverlay = noop }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()

  const handleClick = useCallback(() => {
    if (isAuthedUser) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'upload',
        overlayData: { prevModelId: modelId },
      })
    } else {
      openSignupOverlay('Join to Like, Follow, Share.', 'Version Upload')
      pendo.track('SignUp Prompt Overlay', { source: 'Version Upload' })
    }
  }, [isAuthedUser, dispatch, modelId, openSignupOverlay])

  return (
    <Button secondary className={c.Model_SidebarButton} onClick={handleClick}>
      <div>
        <UploadIcon className={c.Model_VersionButton} />
      </div>
      <Spacer size='.5rem' />
      Upload new version
    </Button>
  )
}

const Details = ({ currentUser, model, openSignupOverlay = noop }) => {
  const c = useStyles()
  return (
    <div className={classnames(c.Model_Row, c.Model_Detail)}>
      <ModelTitle model={model} />
      {model.previousVersionModelId && <Revised modelId={model.previousVersionModelId} />}
      {model.id && (
        <div className={c.Model_SocialButtons}>
          <div>
            <ToggleFollowButton
              currentUser={currentUser}
              profileUserId={model && model.owner && model.owner.id}
              openSignupOverlay={openSignupOverlay}
            />
          </div>
          <div>
            <LikeModelButton
              currentUser={currentUser}
              modelId={model.id}
              profileUserId={model && model.owner && model.owner.id}
              openSignupOverlay={openSignupOverlay}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const StatsAndActions = ({
  c,
  className,
  modelData,
  isAuthedUser,
  openSignupOverlay = noop,
}) => {
  return (
    <div className={classnames(className, c.Model_Column, c.Model_RightColumn)}>
      <div>
        <DownloadLink
          model={modelData}
          isAuthedUser={isAuthedUser}
          openSignupOverlay={openSignupOverlay}
        />
        <Spacer size='1rem' />
        <VersionLink
          modelId={modelData.id}
          isAuthedUser={isAuthedUser}
          openSignupOverlay={openSignupOverlay}
        />
        <Divider />
        <ModelStats model={modelData} />
      </div>
      <Divider />
    </div>
  )
}

const ModelDetailPage = ({ id, currentUser, showBackupViewer }) => {
  const c = useStyles()
  const { navigateWithFlash } = useFlashNotification()
  const { useFetchOnce } = useServices()
  // const timerRef = useRef(null)
  const signUpShown = useRef(false)
  const {
    atom: { data: modelData, isLoading, isLoaded, isError },
  } = useFetchOnce(id, 'model')
  const { title, description } = usePageMeta('model')
  const { dispatch } = useStoreon()
  // const { dispatch, overlay } = useStoreon('overlay')
  // const { isOpen } = overlay
  const openSignupOverlay = useCallback(
    (titleMessage, source) => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signUp',
        overlayData: {
          animateIn: true,
          windowed: true,
          titleMessage,
          source,
        },
      })
      signUpShown.current = true
    },
    [dispatch]
  )

  // useEffect(() => {
  //   document.body.scrollTop = 0
  //   document.documentElement.scrollTop = 0
  //   if (!currentUser && !isOpen && !signUpShown.current) {
  //     timerRef.current = setTimeout(() => {
  //       openSignupOverlay('Where Thangs happen', 'Timer')
  //       pendo.track('SignUp Prompt Overlay - Timer')
  //     }, 20000)

  //     return () => clearTimeout(timerRef.current)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpen])

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
    <>
      <Helmet>
        <title>
          {modelData.name}
          {title}
        </title>
        <meta
          name='description'
          content={`${description}${modelData.description.slice(0, 129)}`}
        />
      </Helmet>
      <div className={c.Model}>
        <div className={c.Model_Column}>
          <Details
            currentUser={currentUser}
            model={modelData}
            openSignupOverlay={openSignupOverlay}
          />
          <div className={c.Model_Row}>
            {showBackupViewer ? (
              <BackupViewer className={c.Model_BackupViewer} model={modelData} />
            ) : (
              <HoopsModelViewer className={c.Model_ModelViewer} model={modelData} />
            )}
          </div>
          <div className={c.Model_Row}>
            <div className={c.Model_LeftColumn}>
              <div>
                <div className={c.Model_ModelDescription}>{modelData.description}</div>
                <div className={c.Model_ModelDetails}>
                  <ModelDetails model={modelData} />
                </div>
                <Divider />
              </div>
              <StatsAndActions
                className={c.Model__mobileOnly}
                c={c}
                modelData={modelData}
                isAuthedUser={!!currentUser}
                openSignupOverlay={openSignupOverlay}
              />
              <RelatedModels modelId={modelData.id} />
              <Divider />
              <CommentsForModel
                modelId={modelData.id}
                currentUser={currentUser}
                openSignupOverlay={openSignupOverlay}
              />
            </div>
            <StatsAndActions
              className={c.Model__desktopOnly}
              c={c}
              modelData={modelData}
              openSignupOverlay={openSignupOverlay}
              isAuthedUser={!!currentUser}
            />
          </div>
        </div>
      </div>
    </>
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
