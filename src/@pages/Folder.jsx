import React, { useEffect, useMemo } from 'react'
import * as R from 'ramda'
import { useParams, useLocation } from 'react-router-dom'
import {
  Breadcrumbs,
  CardCollection,
  Layout,
  Spinner,
  useFlashNotification,
  WithFlash,
} from '@components'
import { useQuery } from '@hooks'
import { Message404 } from './404'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import ModelCardsByIds from '@components/CardCollection/ModelCardsByIds'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(_theme => {
  return {
    Folder: {
      width: '100%',
    },
    Folder_Breadcrumbs: {
      marginBottom: '2.5rem',
    },
  }
})

const Folder = ({ folder, modelCount }) => {
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

const Page = () => {
  const location = useLocation()
  const query = useQuery(location)
  const inviteCode = useMemo(() => query.get('inviteCode'), [query])
  const { folderId } = useParams()
  const { dispatch, folders } = useStoreon('folders')
  const { navigateWithFlash } = useFlashNotification()

  useEffect(() => {
    dispatch(types.FETCH_FOLDER, { folderId, inviteCode })
  }, [dispatch, folderId, inviteCode])

  if (folders.isLoading) {
    return <Spinner />
  } else if (R.isEmpty(folders.currentFolder)) {
    navigateWithFlash('/home', 'The folder entered does not exist')
  } else if (!folders.currentFolder) {
    return <Message404 />
  } else if (folders.isError) {
    return <div>Error loading folder</div>
  }

  const modelCount = R.length(folders.currentFolder.models) || ''
  return <Folder folder={folders.currentFolder} modelCount={modelCount} />
}

const FolderPage = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default FolderPage
