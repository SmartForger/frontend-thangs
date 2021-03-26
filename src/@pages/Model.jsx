import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as R from 'ramda'
import { format } from 'date-fns'
import {
  ARDownloadActionMenu,
  Button,
  CommentsForModel,
  Divider,
  EditModelButton,
  HoopsModelViewer,
  Layout,
  LikeModelButton,
  Markdown,
  ModelDetails,
  ModelTitle,
  ModelViewer as BackupViewer,
  ProgressText,
  RelatedModels,
  Revised,
  ShareActionMenu,
  Spacer,
  Spinner,
  ToggleFollowButton,
} from '@components'
import { ReactComponent as HeartIcon } from '@svg/dropdown-heart.svg'
import { ReactComponent as LicenseIcon } from '@svg/license.svg'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as CalendarIcon } from '@svg/icon-calendar.svg'
import { Message404 } from './404'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { useOverlay, usePageMeta, usePerformanceMetrics, useLocalStorage } from '@hooks'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { pageview, track, perfTrack } from '@utilities/analytics'
// import { useFeature } from '@optimizely/react-sdk'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer, lg_viewer, lgr_viewer, lg, xl },
  } = theme
  return {
    Model: {
      width: '100%',
      maxWidth: '90rem',
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
      maxWidth: '100%',

      [md]: {
        marginRight: '4rem',
        maxWidth: '22rem',
      },
      [lg_viewer]: {
        maxWidth: '30rem',
      },
      [lgr_viewer]: {
        maxWidth: '40rem',
      },
      [xl]: {
        maxWidth: '60rem',
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
      backgroundColor: 'transparent',
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      height: '28.75rem',
      margin: '0 auto',
      position: 'relative',
      width: '100%',

      [md_viewer]: {
        height: '37.5rem',
        backgroundColor: theme.colors.white[400],
        boxShadow: '0 12px 24px 0 rgba(0,0,0,0.05)',
      },

      [lg]: {
        height: '38.5rem',
      },

      [xl]: {
        height: '44rem',
      },
    },
    Model_ModelDescription: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontFamily: '"Montserrat", sans-serif',
      whiteSpace: 'break-spaces',
      overflowWrap: 'anywhere',
    },
    Model_ModelDetails: {
      marginTop: '2rem',
    },
    Model_Detail: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      margin: 0,
    },
    Model_SocialButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 0,
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
        fontWeight: '500',
        marginBottom: '.5rem',
        '&:last-of-type': {
          marginBottom: 0,
        },
      },

      '& svg': {
        marginRight: '.5rem',
      },
    },
    Model_LicenseLink: {
      textDecoration: 'underline',
      display: 'inline',
      cursor: 'pointer',
    },
    Model_LicenseText: {
      fontSize: '.75rem',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '1rem',
      letterSpacing: '-0.02em',
    },
    Model_License: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2rem',
      justifyContent: 'center',

      '& > span': {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
        marginBottom: '.5rem',
        '&:last-of-type': {
          marginBottom: 0,
        },
      },

      '& svg': {
        marginRight: '.5rem',
        flex: 'none',
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
    Model_DownloadAndShareContainer: {
      display: 'inline-flex',
      width: '100%',
    },
    Model_DownloadAR: {
      width: '100%',

      '& > div': {
        width: '100%',
      },

      '& > div > div': {
        width: '100%',
      },
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
        id: model.id,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
          track('Download Model', { modelId: model.id })
        },
      }),
    [dispatch, model.id]
  )

  const handleClick = useCallback(() => {
    if (isAuthedUser) {
      downloadModel()
    } else {
      openSignupOverlay('Join to download.', 'Download')
      track('SignUp Prompt Overlay', { source: 'Download' })
    }
  }, [downloadModel, isAuthedUser, openSignupOverlay])

  const buttonText = useMemo(() => {
    if (model.isAssembly || (model.parts && model.parts.length > 1)) return 'Download All'
    return 'Download Model'
  }, [model])

  return (
    <Button className={c.Model_SidebarButton} onClick={handleClick}>
      {modelDownloadUrl.isLoading ? (
        <ProgressText text='Downloading' />
      ) : modelDownloadUrl.isError ? (
        'Server Error'
      ) : (
        buttonText
      )}
    </Button>
  )
}

const DownloadARLink = ({ model, isAuthedUser, openSignupOverlay = noop }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const downloadModel = useCallback(
    format => {
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id: model.id,
        format,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
          track('Download AR Model', { format, modelId: model.id })
        },
      })
    },
    [dispatch, model.id]
  )

  const handleClick = useCallback(
    format => {
      if (isAuthedUser) {
        downloadModel(format)
      } else {
        openSignupOverlay('Join to download AR models.', 'Download')
        track('SignUp Prompt Overlay', { source: 'Download AR', format })
      }
    },
    [downloadModel, isAuthedUser, openSignupOverlay]
  )

  return (
    <div className={c.Model_DownloadAR}>
      <ARDownloadActionMenu onChange={handleClick} />
    </div>
  )
}

const ModelStats = ({ model = {} }) => {
  const c = useStyles()
  return (
    <div className={c.Model_ModelStats}>
      <span>
        <HeartIcon width={12} height={12} />
        {model.likesCount}&nbsp;Likes
      </span>
      <span>
        <DownloadIcon width={12} height={12} />
        {model.downloadCount}&nbsp;Downloads
      </span>
      <span>
        <CalendarIcon width={12} height={12} />
        {model.created && format(new Date(model.created), 'MMMM d, y')}
      </span>
    </div>
  )
}

// const VersionLink = ({ modelId, isAuthedUser, openSignupOverlay = noop }) => {
//   const c = useStyles()
//   const { setOverlay } = useOverlay()

//   const handleClick = useCallback(() => {
//     if (isAuthedUser) {
//       setOverlay({
//         isOpen: true,
//         template: 'multiUpload',
//         data: {
//           animateIn: true,
//           windowed: true,
//           dialogue: true,
//           previousVersionModelId: modelId,
//         },
//       })
//     } else {
//       openSignupOverlay('Join to Like, Follow, Share.', 'Version Upload')
//       track('SignUp Prompt Overlay', { source: 'Version Upload' })
//     }
//   }, [isAuthedUser, modelId, openSignupOverlay, setOverlay])

//   return (
//     <Button secondary className={c.Model_SidebarButton} onClick={handleClick}>
//       <div>
//         <UploadIcon className={c.Model_VersionButton} />
//       </div>
//       <Spacer size='.5rem' />
//       Upload new version
//     </Button>
//   )
// }

const LicenseText = ({ model, isAuthedUser, openSignupOverlay = noop }) => {
  const c = useStyles()
  const { setOverlay } = useOverlay()

  const handleClick = useCallback(() => {
    if (isAuthedUser) {
      setOverlay({
        isOpen: true,
        template: 'license',
        data: {
          animateIn: true,
          smallWidth: true,
          windowed: true,
          model: model,
        },
      })
    } else {
      openSignupOverlay('Join to Like, Follow, Share.', 'CC License')
      track('SignUp Prompt Overlay', { source: 'CC License' })
    }
  }, [isAuthedUser, model, openSignupOverlay, setOverlay])

  return (
    <div className={c.Model_License}>
      <span>
        <LicenseIcon />
        <div className={c.Model_LicenseText}>
          This model is restricted by licensing terms.&nbsp;
          <div className={c.Model_LicenseLink} onClick={handleClick}>
            View&nbsp;license.
          </div>
        </div>
      </span>
    </div>
  )
}

const Details = ({ currentUser, model, openSignupOverlay = noop }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const isFollowing = R.pathOr(false, ['owner', 'isBeingFollowedByRequester'], model)
  return (
    <div className={classnames(c.Model_Row, c.Model_Detail)}>
      <ModelTitle model={model} />
      {model.previousVersionModelId && (
        <Revised
          modelId={model.previousVersionModelId}
          key={model.previousVersionModelId}
        />
      )}
      {model.id && (
        <div className={c.Model_SocialButtons}>
          <div>
            <ToggleFollowButton
              currentUser={currentUser}
              profileUserId={R.path(['owner', 'id'], model)}
              openSignupOverlay={openSignupOverlay}
              isFollowing={isFollowing}
              onActionStarted={() => {
                dispatch(types.LOCAL_FOLLOW_MODEL_OWNER, {
                  id: model.id,
                  isFollowing,
                })
              }}
              onActionFailured={() => {
                dispatch(types.LOCAL_FOLLOW_MODEL_OWNER, {
                  id: model.id,
                  isFollowing: !isFollowing,
                })
              }}
              hideForOwned={true}
            />
          </div>
          <Spacer size={'1rem'} mobileSize={'.5rem'} />
          <div>
            <LikeModelButton
              model={model}
              openSignupOverlay={openSignupOverlay}
              hideForOwned={true}
            />
          </div>
          <EditModelButton model={model} />
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
  pageTitle,
}) => {
  const filename =
    modelData &&
    modelData.parts &&
    modelData.parts.length &&
    modelData.parts[0] &&
    modelData.parts[0].filename &&
    modelData.parts[0].filename.toLowerCase()
  const isARSupported = filename.includes('stl') || filename.includes('obj')
  return (
    <div className={classnames(className, c.Model_Column, c.Model_RightColumn)}>
      <div>
        <div className={c.Model_DownloadAndShareContainer}>
          <DownloadLink
            model={modelData}
            isAuthedUser={isAuthedUser}
            openSignupOverlay={openSignupOverlay}
          />
          <Spacer size='.5rem' />
          <ShareActionMenu iconOnly={true} title={pageTitle} model={modelData} />
        </div>
        <Spacer size='1rem' />
        {isARSupported && (
          <DownloadARLink
            model={modelData}
            isAuthedUser={isAuthedUser}
            openSignupOverlay={openSignupOverlay}
          />
        )}
        {modelData.license ? (
          <>
            <Spacer size='1rem' />
            <LicenseText
              model={modelData}
              isAuthedUser={isAuthedUser}
              openSignupOverlay={openSignupOverlay}
            />
          </>
        ) : null}
        <Divider />
        <ModelStats model={modelData} />
      </div>
      <Divider />
    </div>
  )
}

const THUMBNAILS_HOST = process.env.REACT_APP_THUMBNAILS_HOST
const ModelDetailPage = ({
  id,
  currentUser,
  showBackupViewer,
  getTime,
  showExternalResults,
}) => {
  const c = useStyles()
  const signUpShown = useRef(false)
  const { setOverlay } = useOverlay()
  const {
    dispatch,
    model: modelAtom = {},
    [`related-models-${id}`]: related = {},
    [`related-models-phyn-${id}`]: relatedPhyn = {},
  } = useStoreon('model', `related-models-${id}`, `related-models-phyn-${id}`)
  const [initialized, setInitialized] = useState(false)
  const { data: modelData, isLoading, isLoaded, isError } = modelAtom
  const {
    isLoading: isRelatedLoading,
    isError: isRelatedError,
    data: relatedCollectionArray = [{}],
  } = related
  const {
    isLoading: isRelatedPhynLoading,
    isError: isRelatedPhynError,
    data: relatedPhynCollectionArray = [],
  } = relatedPhyn

  useEffect(() => {
    dispatch(types.FETCH_MODEL, { id })
    dispatch(types.FETCH_RELATED_MODELS, { id })
    setInitialized(true)
    if (showExternalResults) dispatch(types.FETCH_RELATED_MODELS_PHYN, { id })
  }, [dispatch, id, showExternalResults])

  useEffect(() => {
    if (isLoaded) perfTrack('Page Loaded - Model', getTime())
  }, [getTime, isLoaded])

  const {
    descriptionCreatedBy,
    descriptionPrefix,
    defaultDescription,
    titleSuffix,
    titlePrefix,
  } = usePageMeta('model')
  const openSignupOverlay = useCallback(
    (titleMessage, source) => {
      setOverlay({
        isOpen: true,
        template: 'signUp',
        data: {
          animateIn: true,
          windowed: true,
          titleMessage,
          smallWidth: true,
          source,
        },
      })
      signUpShown.current = true
    },
    [setOverlay]
  )

  const RelatedThangsComponent = React.memo(() => {
    return relatedCollectionArray.map((collection, index) => {
      return (
        <RelatedModels
          data={collection}
          isError={isRelatedError}
          isLoading={isRelatedLoading}
          key={`thangsRelated-${index}`}
          modelName={modelData && modelData.name}
        />
      )
    })
  }, [isRelatedError, isRelatedLoading, modelData, relatedCollectionArray])
  RelatedThangsComponent.displayName = 'RelatedThangsComponent'

  const RelatedPhynComponent = React.memo(() => {
    if (!showExternalResults) return null
    return relatedPhynCollectionArray.map((collection, index) => {
      return (
        <RelatedModels
          data={collection}
          isError={isRelatedPhynError}
          isHideEmpty={true}
          isLoading={isRelatedPhynLoading}
          isPublicResults={true}
          key={`thangsRelated-${index}`}
          modelName={modelData && modelData.name}
        />
      )
    })
  }, [isRelatedPhynError, isRelatedPhynLoading, modelData, relatedPhynCollectionArray])
  RelatedPhynComponent.displayName = 'RelatedPhynComponent'

  if (isLoading || !isLoaded || !initialized) {
    return <Spinner />
  } else if (R.isEmpty(modelData)) {
    return <Message404 />
  } else if (!modelData) {
    return <Message404 />
  } else if (isError) {
    return <div>Error loading Model</div>
  }
  let titleCharCount = 60
  let modelTitle = modelData.name
  let modelAuthor = modelData.owner && modelData.owner.username
  titleCharCount = titleCharCount - titleSuffix.length
  titleCharCount = titleCharCount - titlePrefix.length
  if (titleCharCount < modelTitle.length)
    modelTitle = modelTitle.substring(0, titleCharCount)
  titleCharCount = titleCharCount - modelTitle.length
  const modelTitleAuthor = titleCharCount >= modelAuthor.length + 3 ? modelAuthor : ''
  const pageTitle = `${modelTitle}${titlePrefix}|${
    modelTitleAuthor ? ` ${modelTitleAuthor} |` : ''
  }${titleSuffix}`
  const modelDescription = modelData.description || defaultDescription

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name='description'
          content={`${descriptionPrefix}${
            modelData.name
          }, ${descriptionCreatedBy}${modelAuthor}. ${modelDescription.slice(0, 160)}`}
        />
        <meta property='og:title' content={pageTitle} />
        <meta
          property='og:description'
          content={`${descriptionPrefix}${
            modelData.name
          }, ${descriptionCreatedBy}${modelAuthor}. ${modelDescription.slice(0, 160)}`}
        />
        <meta
          property='og:image'
          content={`${THUMBNAILS_HOST}${modelData.uploadedFile}`}
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
                <Markdown className={c.Model_ModelDescription}>
                  {modelDescription}
                </Markdown>
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
                pageTitle={pageTitle}
              />
              <RelatedThangsComponent />
              <RelatedPhynComponent />
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
              pageTitle={pageTitle}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const Page = () => {
  const { id, modelString } = useParams()
  const modelId = modelString ? modelString.split('-').pop() : id
  const [showBackupViewer] = useLocalStorage('showBackupViewer', false)
  const [showExternalResults] = useLocalStorage('showExternalResults', false)
  const [currentUser] = useLocalStorage('currentUser', null)
  const { getTime, startTimer } = usePerformanceMetrics()

  useEffect(() => {
    pageview('Model', modelId)
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModelDetailPage
      id={modelId}
      currentUser={currentUser}
      showBackupViewer={showBackupViewer}
      showExternalResults={showExternalResults}
      getTime={getTime}
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
