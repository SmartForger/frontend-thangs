import React, { useCallback } from 'react'
import { FOLDER_MENU_OPTIONS } from '@constants/menuOptions'
import {
  ContainerRow,
  FolderActionMenu,
  Pill,
  Spacer,
} from '@components'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload-black.svg'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

const ModelActionToolbar = ({ folder = {} }) => {
  const { setOverlay } = useOverlay()

  const handleAddFolder = useCallback(() => {
    track('Add Menu - Create Folder')
    setOverlay({
      isOpen: true,
      template: 'addFolder',
      data: {
        folder,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder, setOverlay])

  const handleUpload = useCallback(() => {
    track('Add Menu - Upload Models')
    setOverlay({
      isOpen: true,
      template: 'multiUpload',
      data: {
        folderId: folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder, setOverlay])

  return (
    <ContainerRow alignItems={'center'}>
      <Pill secondary onClick={handleUpload}>
        <UploadIcon />
        <Spacer size={'0.5rem'} />
        Upload Models
      </Pill>
      <Spacer size={'1rem'} />
      <Pill secondary onClick={handleAddFolder}>
        <FolderIcon />
        <Spacer size={'0.5rem'} />
        Add Folder
      </Pill>
      <Spacer size={'1rem'} />
      <FolderActionMenu
        folder={folder}
        omitOptions={[FOLDER_MENU_OPTIONS.CREATE_FOLDER]}
      />
    </ContainerRow>
  )
}

export default ModelActionToolbar
