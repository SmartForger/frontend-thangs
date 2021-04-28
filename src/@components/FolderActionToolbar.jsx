import React, { useCallback } from 'react'

import {
  Contributors,
  ContainerRow,
  LikeFolderButton,
  Pill,
  Spacer,
  IconButton,
} from '@components'
import { ReactComponent as FolderIcon } from '@svg/icon-add-folder.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload-black.svg'
import { ReactComponent as UploadIconSmall } from '@svg/icon-upload-black-sm.svg'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

const FolderActionToolbar = ({ folder = {}, isPrimaryActionHidden = false }) => {
  const { setOverlay } = useOverlay()

  const handleInviteUsers = useCallback(() => {
    track('FolderActionToolbar - Invite Members')
    setOverlay({
      isOpen: true,
      template: 'inviteUsers',
      data: {
        folderId: folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder.id, setOverlay])

  const handleAddFolder = useCallback(() => {
    track('FolderActionToolbar - Create Folder')
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
    track('FolderActionToolbar - Upload Models')
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
      {isPrimaryActionHidden ? (
        <IconButton onClick={handleUpload}>
          <UploadIcon />
        </IconButton>
      ) : (
        <Pill primary onClick={handleUpload}>
          <UploadIconSmall />
          <Spacer size={'0.5rem'} />
          Upload
        </Pill>
      )}
      <Spacer size={'0.5rem'} />
      <IconButton onClick={handleAddFolder}>
        <FolderIcon />
      </IconButton>
      <Spacer size={'0.5rem'} />
      <LikeFolderButton folder={folder} onlyShowOwned />
      <Spacer size={'0.5rem'} />
      <Contributors
        onClick={handleInviteUsers}
        users={[folder.creator, ...(folder?.members || [])]}
        displayLength='5'
      />
    </ContainerRow>
  )
}

export default FolderActionToolbar
