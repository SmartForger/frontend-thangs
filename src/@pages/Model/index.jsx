import React from 'react'
import { useHistory, Link, useParams } from 'react-router-dom'

import { LikeModelButton } from '@components/LikeModelButton'
import CommentsForModel from '@components/CommentsForModel'
import ModelViewer from '@components/HoopsModelViewer'
import { ModelViewer as BackupViewer } from '@components/ModelViewer'
import { Button } from '@components/Button'
import { Spinner } from '@components/Spinner'
import { ProgressText } from '@components/ProgressText'
import { RelatedModels } from '@components/RelatedModels'
import { ModelTitle } from '@components/ModelTitle'

import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg'
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg'

import { useLocalStorage } from '@customHooks/Storage'
import { useDownloadModel } from '@customHooks/Models'
import * as GraphqlService from '@services/graphql-service'
import { NewThemeLayout } from '@components/Layout'

import { ModelDetails } from '../ModelPreview/ModelDetails'
import { Message404 } from '../404'
import { createUseStyles } from '@style'

const graphqlService = GraphqlService.getInstance()

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { sm, md, lg, xl },
  } = theme
  return {
    Model: {},
    Model_Header: {
      display: 'flex',
      alignItems: 'center',
      margin: '.5rem 0 1rem',
    },
    Model_Row: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '1.5rem',
      '&:last-of-type': {
        marginBottom: 0,
      },
      [lg]: {
        marginBottom: '3rem',
      },
      '& > div': {
        flexGrow: 1,
      },
    },
    Model_Column: {
      display: 'flex',
      flexDirection: 'column',

      [lg]: {
        marginRight: '3rem',
        '&:last-of-type': {
          marginRight: 0,
        },
      },
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
      margin: '0 -1rem',
      width: 'calc(100% + 2rem)',

      [sm]: {
        height: '28.75rem',
      },

      [md]: {
        height: '37.5rem',
        margin: 0,
        width: '100%',
      },

      [lg]: {
        height: '38.5rem',
        width: 'auto',
      },

      [xl]: {
        height: '38.5rem',
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
    Model_TitleText: {
      ...theme.mixins.text.modelTitleText,
      marginBottom: '.5rem',
    },
    Model_ProfileLink: {
      ...theme.mixins.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
    Model_Description: {
      margin: '2rem 0',
    },
    Model_DownloadButton: {
      ...theme.mixins.text.linkText,
      width: '7.75rem',
      textAlign: 'left',
      marginBottom: '1.5rem',
    },
    Model_VersionHeader: {
      ...theme.mixins.text.formCalloutText,
    },
    Model_VersionLinkText: {
      ...theme.mixins.text.linkText,
    },
    Model_VersionButton: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.5rem',
      marginTop: '1.5rem',
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
  }
})

function DownloadLink({ model }) {
  const c = useStyles()
  const [isDownloading, hadError, downloadModel] = useDownloadModel(model)
  return (
    <Button text className={c.Model_DownloadButton} onClick={downloadModel}>
      {isDownloading ? (
        <ProgressText text='Downloading' />
      ) : hadError ? (
        'Server Error'
      ) : (
        'Download Model'
      )}
    </Button>
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

const Revised = () => {
  const c = useStyles()
  return (
    <div className={c.Model_RevisedLabel}>
      <VersionIcon className={c.Model_VersionIcon} />
      <div>Revised from</div>
      <Button text className={c.Model_VersionLinkText}>
        Geofry Thomas
      </Button>
    </div>
  )
}

function Details({ currentUser, model, className }) {
  const c = useStyles()
  return (
    <div className={className}>
      <Revised />
      <ModelTitle model={model} />
      <LikeModelButton currentUser={currentUser} model={model} />
      <div className={c.Model_Description}>{model.description}</div>
      <DownloadLink model={model} />
      <ModelDetails model={model} />
    </div>
  )
}

const ModelDetailPage = ({ model, currentUser, showBackupViewer }) => {
  const c = useStyles()
  const history = useHistory()

  return (
    <>
      <div className={c.Model_Header}>
        <Button back onClick={() => history.goBack()}>
          <BackArrow />
        </Button>
      </div>
      <div className={c.Model_Row}>
        <div className={c.Model_Column}>
          <div className={c.Model_Row}>
            {showBackupViewer ? (
              <BackupViewer className={c.Model_BackupViewer} model={model} />
            ) : (
              <ModelViewer className={c.Model_ModelViewer} model={model} />
            )}
          </div>
          <div className={c.Model_Row__mobile}>
            <Details currentUser={currentUser} model={model} />
          </div>
          <div className={c.Model_Row}>
            <RelatedModels modelId={model.id} />
          </div>
          <div className={c.Model_Row__mobile}>
            <CommentsForModel model={model} />
          </div>
        </div>
        <div className={c.Model_Column__desktop}>
          <div className={c.Model_Row}>
            <Details currentUser={currentUser} model={model} />
          </div>
          <div className={c.Model_Row}>
            <VersionUpload modelId={model.id} />
          </div>
          <div className={c.Model_Row}>
            <CommentsForModel model={model} />
          </div>
        </div>
      </div>
    </>
  )
}

function Page() {
  const { id } = useParams()
  const [showBackupViewer] = useLocalStorage('showBackupViewer', false)

  const { loading, error, model } = graphqlService.useModelById(id)
  const [currentUser] = useLocalStorage('currentUser', null)

  if (loading) {
    return <Spinner />
  } else if (!model) {
    return <Message404 />
  } else if (error) {
    return <div>Error loading Model</div>
  }
  return (
    <ModelDetailPage
      model={model}
      currentUser={currentUser}
      showBackupViewer={showBackupViewer}
    />
  )
}

export const ModelDetail = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
