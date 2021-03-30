import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import {
  ContainerColumn,
  ContainerRow,
  CollaboratorInfo,
  HoopsModelViewer,
  Spacer,
  FileHeader,
  ModelStatBar,
  ModelInfo,
  TabbedFileContent,
} from '@components'
import { CompareModels } from '@physna/compare-ui'
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
      height: '28.75rem',
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
    FileView_CompareWrapper: {
      height: '25rem',
    },
  }
})

const noop = () => null

const getCounts = model => {
  const collaboratorCount = 3
  const likeCount = 3
  return {
    collaboratorCount,
    likeCount,
  }
}

const FileView = ({ className }) => {
  const c = useStyles()
  const { fileId: id } = useParams()
  const [activePart, setActivePart] = useState([id])
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

  return (
    <main className={classnames(className, c.FileView)}>
      {isLoading || !modelData ? (
        <FileViewSkeleton />
      ) : (
        <div className={c.FileView_Content}>
          <Spacer size='2rem' />
          <FileHeader model={modelData} />{' '}
          {/* This needs to know the modelData and the names and ids of all parent folders of model */}
          <Spacer size='2rem' />
          {/* <HoopsModelViewer
            className={c.Model_ModelViewer}
            model={modelData}
            minimizeTools={true}
            initialSelectedModel={activePart}
          /> */}
          <ContainerRow className={c.FileView_CompareWrapper}>
            <CompareModels
              modelAId={'367ccd6b-003f-4ae9-9d25-22cf3afc0a8f'}
              modelBId={'b2ded074-3c20-474c-858b-1dbdec39ca27'}
              modelABucket={'dev-tenant1-headless-bucket'}
              modelBBucket={'dev-tenant1-headless-bucket'}
              destinationBucket={'localdev-najela-alignment-service'}
              comparisonServiceEndpoint={
                'https://staging-comparison-service-dot-gcp-and-physna.uc.r.appspot.com/'
              }
              comparisonsToDisplay={{
                model_a: true,
                model_b: false,
                difference_a: true,
                difference_b: true,
                intersection_a: false,
                intersection_b: false,
              }}
              variant={{
                type: 'sideBySide',
              }}
            />
          </ContainerRow>
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
              <ModelInfo
                model={modelData}
                folderName={'Public Files'}
                modelPrivacy='Private'
              />
              <Spacer size='2rem' />
              <CollaboratorInfo owner={modelData.owner} collaborators={[]} />
            </ContainerColumn>
            <Spacer size='4rem' />
            <ContainerColumn fullWidth className={c.FileView_RightColumn}>
              <TabbedFileContent model={modelData} onRowSelect={handleRowSelect} />
            </ContainerColumn>
          </ContainerRow>
        </div>
      )}
    </main>
  )
}

export default FileView
