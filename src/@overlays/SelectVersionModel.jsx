import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import {
  OverlayWrapper,
  SearchInput,
  SingleLineBodyText,
  Spacer,
  PartTable,
} from '@components'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { useOverlay } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'
import * as types from '@constants/storeEventTypes'

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

const SelectVersionModel = ({ model, part, files, fileIndex }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
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
    const previousParts = model.parts.filter(part =>
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
          model: model || part,
          part: part || model,
          files,
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
          model,
          part,
          files,
          fileIndex: fileIndex + 1,
        },
      })
    }
  }, [
    currentFile.id,
    dispatch,
    fileIndex,
    files,
    lastFile,
    model,
    part,
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
          model,
          part,
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
          model,
          part,
          files,
          fileIndex: fileIndex - 1,
        },
      })
    }
  }, [fileIndex, files, model, part, setOverlay])

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
    >
      <div className={c.SelectVersionModel_NewFile}>
        <FileIcon />
        <Spacer size={'.5rem'} />
        <SingleLineBodyText>{currentFile && currentFile.name}</SingleLineBodyText>
      </div>
      <Spacer size={'1rem'} />
      <SearchInput onChange={handleFilterChange} />
      <Spacer size={'.5rem'} />
      <PartTable
        model={model}
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
