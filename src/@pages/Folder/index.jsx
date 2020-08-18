import React, { useEffect } from 'react'
import * as R from 'ramda'
import { useParams } from 'react-router-dom'
import { useCurrentUser } from '@hooks'
import { Breadcrumbs, CardCollection, Layout, Spinner, WithFlash } from '@components'
import { Message404 } from '../404'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import ModelCardsByIds from '@components/CardCollection/ModelCardsByIds'

const useStyles = createUseStyles(_theme => {
  return {
    Folder: {
      width: '100%'
    },
    Folder_Breadcrumbs: {
      marginBottom: '2.5rem',
    },
  }
})

function Folder({ folder, modelCount }) {
  const c = useStyles()
  return (
    <div className={c.Folder}>
      <Breadcrumbs
        className={c.Folder_Breadcrumbs}
        modelsCount={modelCount}
        folder={folder}
      ></Breadcrumbs>
      <WithFlash>
        <CardCollection noResultsText='Upload models to this folder and collaborate with other users privately.'>
          <ModelCardsByIds items={folder.models} />
        </CardCollection>
      </WithFlash>
    </div>
  )
}

function Page() {
  const { folderId } = useParams()
  const { dispatch, folders } = useStoreon('folders')

  useEffect(() => {
    dispatch('fetch-folder', folderId)
  }, [dispatch, folderId])

  const { loading: userLoading, error: userError, user } = useCurrentUser()

  if (userLoading || folders.isLoading) {
    return <Spinner />
  } else if (!folders.currentFolder || !user) {
    return <Message404 />
  } else if (userError || folders.loadError) {
    return <div>Error loading folder</div>
  }

  const modelCount = R.length(folders.currentFolder.models) || ''
  return <Folder folder={folders.currentFolder} modelCount={modelCount} />
}

export const FolderPage = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
