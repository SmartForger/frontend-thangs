import React from 'react'

import { useHistory, Link } from 'react-router-dom'
import { ProfilePicture } from '@components/ProfilePicture'
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg'
import { Button } from '@components/Button'
import { ModelDetails } from './ModelDetails'
import { LikeModelButton } from '@components/LikeModelButton'
import ModelViewer from '@components/HoopsModelViewer'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelPreviewPage: {},
    ModelPreviewPage_Header: {
      display: 'flex',
      alignItems: 'center',
      margin: '.5rem 0 1rem',
    },
    ModelPreviewPage_ModelContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    ModelPreviewPage_ModelViewerContainer: {
      flexGrow: 1,
      borderRadius: '.5rem',
      boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.15)',
      height: '26rem',
      minWidth: '50%',
      marginTop: '.5rem',
      marginRight: '3.5rem',
      marginBottom: '3rem',
    },
    ModelPreviewPage_Sidebar: {
      margin: '.5rem 0 0 .5rem',
      minWidth: '25rem',

      '& > table': {
        marginBottom: '1.5rem',
        lineHeight: 18,
      },
      '& > table td:first-child': {
        color: theme.variables.colors.modelDetailLabel,
        fontSize: '.75rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        textTransform: 'uppercase',
      },
    },
    ModelPreviewPage_PrimaryButton: {
      background: theme.variables.colors.modelPrimaryButtonBackground,
      color: theme.variables.colors.modelPrimaryButtonText,
      marginBottom: '1.5rem',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '.75rem 1.75rem',
      fontSize: '1rem',
      fontWeight: 500,
      borderRadius: '.5rem',
      display: 'inline-block',
      textDecoration: 'none',
    },
    ModelPreviewPage_ModelTitleContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: '.5rem 0',
    },
    ModelPreviewPage_ModelTitleContent: {
      flexDirection: 'column',
    },
    ModelPreviewPage_ModelOwnerProfilePicture: {
      marginRight: '1rem',
    },
    ModelPreviewPage_ModelTitleText: {
      display: 'block',
      color: theme.variables.colors.modelTitleText,
      fontSize: '1.5rem',
    },
    ModelPreviewPage_ModelOwnerLink: {
      display: 'block',
      color: theme.variables.colors.modelOwnerLink,
      fontSize: '1rem',
      fontWeight: 500,
      textDecoration: 'none',
    },
  }
})

function ModelTitle({ model, className }) {
  const c = useStyles()
  return (
    <div className={classnames(className, c.ModelPreviewPage_ModelTitleContainer)}>
      {model.owner && (
        <ProfilePicture
          className={c.ModelPreviewPage_ModelOwnerProfilePicture}
          size='48px'
          name={model.owner.fullName}
          src={model.owner.profile.avatarUrl}
        />
      )}
      <div className={c.ModelPreviewPage_ModelTitleContent}>
        <span className={c.ModelPreviewPage_ModelTitleText}>{model.name}</span>
        {model.owner && (
          <Link
            className={c.ModelPreviewPage_ModelOwnerLink}
            to={`/profile/${model.owner.id}`}
          >
            {model.owner.fullName}
          </Link>
        )}
      </div>
    </div>
  )
}

const ModelPreviewPage = ({ model, currentUser }) => {
  const history = useHistory()
  const c = useStyles()

  return (
    <>
      <div className={c.ModelPreviewPage_Header}>
        <Button back onClick={() => history.goBack()}>
          <BackArrow />
        </Button>
      </div>
      <div className={c.ModelPreviewPage_ModelContainer}>
        <div className={c.ModelPreviewPage_ModelViewerContainer}>
          <ModelViewer model={model} />
        </div>
        <div className={c.ModelPreviewPage_Sidebar}>
          <ModelTitle model={model} />
          <LikeModelButton currentUser={currentUser} model={model} />
          <ModelDetails model={model} />
          <Link className={c.ModelPreviewPage_PrimaryButton} to={`/model/${model.id}`}>
            View details
          </Link>
        </div>
      </div>
    </>
  )
}

export { ModelPreviewPage }
