import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import * as types from '@constants/storeEventTypes'
import { OverlayWrapper, SearchInput, Spacer, PartTable } from '@components'
import { useOverlay } from '@hooks'
import { overlayview } from '@utilities/analytics'

import { ReactComponent as FileIcon } from '@svg/icon-file.svg'

const useStyles = createUseStyles(_theme => {
  return {
    SelectVersionModel: {},
    SelectVersionModel_NewFile: {
      display: 'flex',
      flexDirection: 'row',

      '& > span': {
        lineHeight: '1.125rem',
        alignSelf: 'center',
      },
    },
  }
})

const SelectVersionModel = ({ fileIndex }) => {
  const c = useStyles()
  const { dispatch, uploadFiles = {}, model = {} } = useStoreon('model', 'uploadFiles')
  const { data: files = {} } = uploadFiles
  const { data: modelData = {}, isLoading: isLoadingModel } = model
  const [selectedParts, setSelectedParts] = useState([])
  const [inputState, setInputState] = useState({
    filter: '',
  })
  const currentFileKey = Object.keys(files)[fileIndex]
  const currentFile = files[currentFileKey]
  const lastFile = useMemo(() => fileIndex === Object.keys(files).length - 1, [
    fileIndex,
    files,
  ])
  const { setOverlay } = useOverlay()

  const handleFilterChange = useCallback(value => {
    setInputState({
      filter: value,
    })
  }, [])

  const handleContinue = useCallback(() => {
    const previousParts = modelData.parts.filter(part =>
      selectedParts.includes(part.partIdentifier)
    )

    dispatch(types.SET_MODEL_INFO, {
      id: currentFile.id,
      formData: {
        previousParts,
      },
    })

    if (lastFile) {
      setOverlay({
        isOpen: true,
        template: 'reviewVersion',
        data: {
          animateIn: false,
          windowed: true,
          dialogue: true,
        },
      })
    } else {
      setOverlay({
        isOpen: true,
        template: 'selectVersionModel',
        data: {
          animateIn: false,
          windowed: true,
          dialogue: true,
          fileIndex: fileIndex + 1,
        },
      })
    }
  }, [
    currentFile.id,
    dispatch,
    fileIndex,
    lastFile,
    modelData.parts,
    selectedParts,
    setOverlay,
  ])

  const handleCancel = useCallback(() => {
    if (fileIndex === 0) {
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          action: 'update',
          versionData: {
            modelId: model.id,
          },
        },
      })
    } else {
      setOverlay({
        isOpen: true,
        template: 'selectVersionModel',
        data: {
          animateIn: false,
          windowed: true,
          dialogue: true,
          fileIndex: fileIndex - 1,
        },
      })
    }
  }, [fileIndex, model, setOverlay])

  useEffect(() => {
    overlayview('SelectVersionModel')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <OverlayWrapper
      overlayHeader={'Version model'}
      overlayTitle={'Select which models to version'}
      overlaySubTitle={
        'You can select one or multiple parts to override with your new model version.'
      }
      onCancel={handleCancel}
      onContinue={handleContinue}
      cancelText={'Back'}
      continueText={'Continue'}
      isLoading={isLoadingModel}
    >
      <div className={c.SelectVersionModel_NewFile}>
        <FileIcon />
        <Spacer size={'.5rem'} />
        <Body>{currentFile && currentFile.name}</Body>
      </div>
      <Spacer size={'1rem'} />
      <SearchInput onChange={handleFilterChange} />
      <Spacer size={'.5rem'} />
      <PartTable
        model={modelData}
        selectedParts={selectedParts}
        setSelectedParts={setSelectedParts}
        filterTerm={inputState.filter}
        file={currentFile}
      />
      <Spacer size={'1.5rem'} />
    </OverlayWrapper>
  )
}

export default SelectVersionModel
