import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import {
  CompareViewer,
  ContainerColumn,
  ContainerRow,
  Spacer,
  FileHeader,
  HoopsModelViewer,
  ModelStatBar,
  ModelInfoBox,
  ModelCollaboratorBox,
  TabbedFileContent,
  Tabs,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import FileViewSkeleton from './ViewSkeleton'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer, lg, xl },
  } = theme
  return {
    FileView: {
      display: 'flex',
      flexDirection: 'row',
      minHeight: '88vh',
      margin: '0 2rem',

      '& > div': {
        flex: 'none',
      },
    },
    FileView_Content: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    FileView_LeftColumn: {
      width: '24.875rem',

      '& > div': {
        width: '100%',
        boxSizing: 'border-box',
      },
    },
    FileView_RightColumn: {
      minWidth: '37.5rem',
    },
    Model_ModelViewer: {
      backgroundColor: theme.colors.white[600],
      borderRadius: '.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '40.5rem !important',
      margin: '0 auto',
      position: 'relative',
      width: '100%',

      [md_viewer]: {
        height: '37.5rem',
        backgroundColor: theme.colors.white[600],
      },

      [lg]: {
        height: '38.5rem',
      },

      [xl]: {
        height: '40.5rem',
      },
    },
    FileView_Tabs: {
      justifyContent: 'center',
    },
  }
})

const getCounts = () => {
  const collaboratorCount = 3
  const likeCount = 3
  return {
    collaboratorCount,
    likeCount,
  }
}

const FileView = ({ className, folders }) => {
  const c = useStyles()
  const { fileId: id } = useParams()
  // eslint-disable-next-line no-unused-vars
  const [activePart, setActivePart] = useState([id])
  const [activeViewer, setActiveViewer] = useState('single')
  const { dispatch, model = {}, modelHistory = {} } = useStoreon('model', 'modelHistory')
  const { data: modelData, isLoading } = model
  const {
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    data: historyData = [],
  } = modelHistory

  useEffect(() => {
    dispatch(types.FETCH_MODEL, { id })
    dispatch(types.FETCH_MODEL_HISTORY, { id })
  }, [dispatch, id])

  const handleRowSelect = useCallback(idArray => {
    setActivePart(idArray)
  }, [])

  const { collaboratorCount, likeCount } = getCounts(modelData)
  const handleViewerChange = useCallback(viewerType => {
    setActiveViewer(viewerType)
  }, [])
  const viewerOptions = [
    {
      label: 'Single',
      value: 'single',
    },
    {
      label: 'Compare',
      value: 'compare',
    },
  ]
  return (
    <main className={classnames(className, c.FileView)}>
      {isLoading || !modelData ? (
        <FileViewSkeleton />
      ) : (
        <div className={c.FileView_Content}>
          <Spacer size='2rem' />
          <FileHeader file={modelData} folders={folders} />
          {/* This needs to know the modelData and the names and ids of all parent folders of model */}
          <Spacer size='2rem' />
          {historyData.length && (
            <Tabs
              className={c.FileView_Tabs}
              onChange={handleViewerChange}
              options={viewerOptions}
              selectedValue={activeViewer}
            />
          )}
          <Spacer size='1rem' />
          {activeViewer === 'single' && (
            <HoopsModelViewer
              className={c.Model_ModelViewer}
              model={modelData}
              minimizeTools={true}
              initialSelectedModel={activePart}
            />
          )}
          {historyData.length && activeViewer === 'compare' && <CompareViewer />}
          <Spacer size='2rem' />
          <ContainerRow>
            <ContainerColumn className={c.FileView_LeftColumn}>
              <ModelStatBar
                collaboratorCount={collaboratorCount}
                versionCount={
                  isLoadingHistory || isErrorHistory ? '?' : historyData.length
                }
                likeCount={likeCount}
              />
              <Spacer size='2rem' />
              <ModelInfoBox
                model={modelData}
                folderName={'Public Files'}
                modelPrivacy='Private'
              />
              <Spacer size='2rem' />
              {modelData.folderId && <ModelCollaboratorBox />}
            </ContainerColumn>
            <Spacer size='4rem' />
            <ContainerColumn fullWidth className={c.FileView_RightColumn}>
              <TabbedFileContent
                model={modelData}
                onRowSelect={handleRowSelect}
                setActiveViewer={setActiveViewer}
              />
            </ContainerColumn>
          </ContainerRow>
        </div>
      )}
    </main>
  )
}

export default FileView
