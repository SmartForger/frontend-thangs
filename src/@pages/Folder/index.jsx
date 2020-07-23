import React from 'react'
import * as R from 'ramda'
import { useParams } from 'react-router-dom'
import { useFolder } from '@customHooks/Folders'
import { useCurrentUser } from '@customHooks/Users'

import { WithFlash } from '@components/Flash'
import { Spinner } from '@components/Spinner'
import CardCollection from '@components/CardCollection'
import Breadcrumbs from '@components/Breadcrumbs'
import { NewThemeLayout } from '@components/Layout'
import { Message404 } from '../404'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Folder: {},
    Folder_Breadcrumbs: {
      marginBottom: '2.5rem',
    },
  }
})

function Folder({ folder, _modelCount }) {
  const c = useStyles()
  return (
    <div>
      <Breadcrumbs
        className={c.Folder_Breadcrumbs}
        modelsCount={6}
        folder={folder}
      ></Breadcrumbs>
      <WithFlash>
        <CardCollection
          models={folder.models}
          noResultsText='Upload models to this folder and collaborate with other users privately.'
        />
      </WithFlash>
    </div>
  )
}

function Page() {
  const { folderId } = useParams()

  const { loading, error, folder } = useFolder(folderId)
  const { loading: userLoading, error: userError, user } = useCurrentUser()

  if (loading || userLoading) {
    return <Spinner />
  } else if (!folder || !user) {
    return <Message404 />
  } else if (error | userError) {
    return <div>Error loading folder</div>
  }

  const modelCount = R.length(user.models)
  return <Folder folder={folder} modelCount={modelCount} />
}

export const FolderPage = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
