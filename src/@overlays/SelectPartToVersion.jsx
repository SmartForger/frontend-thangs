import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { Body, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'
import * as types from '@constants/storeEventTypes'
import {
  Compare,
  ContainerRow,
  FormError,
  OverlayWrapper,
  SearchInput,
  Spacer,
  PartSelectionTable,
} from '@components'
import { useOverlay } from '@hooks'
import { overlayview } from '@utilities/analytics'
import { flattenTree } from '@utilities/tree'

import { getPreviousParts } from '@selectors'
import { formatBytes } from '@utilities'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'

const SelectPartToVersion = ({ fileIndex }) => {
  const { dispatch, uploadModelFiles = {}, model = {} } = useStoreon(
    'model',
    'uploadModelFiles'
  )
  const { data: files = {}, formData = {} } = uploadModelFiles
  const { data: modelData = {}, isLoading: isLoadingModel } = model
  const currentFileKey = Object.keys(files)[fileIndex]
  const [selectedDiffModel, setSelectedDiffModel] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(null)
  const previouslySelectedParts = useMemo(() => getPreviousParts(formData), [formData])
  const selectedParts = useMemo(() => formData[currentFileKey]?.previousParts || [], [
    currentFileKey,
    formData,
  ])
  const [inputState, setInputState] = useState({
    filter: '',
  })
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
    if (!selectedParts.length) {
      setErrorMessage('Please select a part to update.')
      return
    }

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
        template: 'selectPartToVersion',
        data: {
          animateIn: false,
          windowed: true,
          dialogue: true,
          fileIndex: fileIndex + 1,
        },
      })
    }
  }, [fileIndex, lastFile, selectedParts.length, setOverlay])

  const handleClose = useCallback(() => {
    dispatch(types.RESET_UPLOAD_FILES)
  }, [dispatch])

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
        template: 'selectPartToVersion',
        data: {
          animateIn: false,
          windowed: true,
          dialogue: true,
          fileIndex: fileIndex - 1,
        },
      })
    }
  }, [fileIndex, model, setOverlay])

  const handleSelectParts = useCallback(
    newSelectedParts => {
      dispatch(types.SET_MODEL_INFO, {
        id: currentFile.id,
        formData: {
          previousParts: newSelectedParts,
        },
      })
    },
    [currentFile.id, dispatch]
  )

  useEffect(() => {
    overlayview('selectPartToVersion')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allParts = useMemo(() => {
    let result = []
    const list = flattenTree(modelData.parts, 'parts').filter(part => {
      if (
        selectedParts.includes(part.partIdentifier) ||
        !previouslySelectedParts.includes(part.partIdentifier)
      ) {
        return inputState.filter ? part.name.includes(inputState.filter) : true
      }
    })
    return result.concat(list)
  }, [modelData.parts, selectedParts, previouslySelectedParts, inputState.filter])

  useEffect(() => {
    setErrorMessage('')
    if (formData[currentFileKey]?.previousParts) {
      handleSelectParts(formData[currentFileKey]?.previousParts ?? [])
    } else {
      handleSelectParts(
        allParts.reduce(
          (acc, part) =>
            part.name === currentFileKey ? [...acc, part.partIdentifier] : acc,
          []
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFileKey])

  const compareModels = useMemo(
    () => [
      {
        model1: selectedDiffModel,
        model2: currentFile,
      },
    ],
    [selectedDiffModel, currentFile]
  )

  return (
    <OverlayWrapper
      overlayHeader={'Select part to version'}
      overlayTitle={'Select which parts to version'}
      overlaySubTitle={
        'You can select one or more parts to update with your newly uploaded model.'
      }
      onCancel={handleCancel}
      onClose={handleClose}
      onContinue={handleContinue}
      cancelText={'Back'}
      continueText={'Continue'}
      isLoading={isLoadingModel}
    >
      <ContainerRow alignItems={'center'}>
        <FileIcon />
        <Spacer size={'.5rem'} />
        <Body>{currentFile && currentFile.name}</Body>
        <Spacer size={'.25rem'} />
        <Metadata type={MetadataType.secondary}>
          {!currentFile || !currentFile.size ? '' : formatBytes(currentFile.size)}
        </Metadata>
      </ContainerRow>
      <Spacer size={'.75rem'} />
      {selectedDiffModel && (
        <>
          <Spacer size={'1rem'} />
          <Compare models={compareModels} />
          <Spacer size={'1rem'} />
        </>
      )}
      {allParts.length > 20 && (
        <>
          <SearchInput onChange={handleFilterChange} />
          <Spacer size={'1rem'} />
        </>
      )}
      <PartSelectionTable
        allNodes={allParts}
        selectedParts={selectedParts}
        onSelectParts={handleSelectParts}
        onCompare={setSelectedDiffModel}
        selectedDiffModel={selectedDiffModel}
      />
      <Spacer size={'1.5rem'} />
      {errorMessage && (
        <>
          <FormError>{errorMessage}</FormError>
          <Spacer size='1rem' />
        </>
      )}
    </OverlayWrapper>
  )
}

export default SelectPartToVersion
