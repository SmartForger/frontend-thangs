import React, { useCallback } from 'react'

import {
  ContainerRow,
  Contributors,
  IconButton,
  LikeFolderButton,
  Pill,
  Spacer,
  Tooltip,
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
      <Tooltip title={'Upload a new model to folder'} defaultPlacement={'bottom'}>
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
      </Tooltip>
      <Spacer size={'0.5rem'} />
      <Tooltip title={'Create a new subfolder'} defaultPlacement={'bottom'}>
        <IconButton onClick={handleAddFolder}>
          <FolderIcon />
        </IconButton>
      </Tooltip>
      <Spacer size={'0.5rem'} />
      <Tooltip title={'Star a folder'} defaultPlacement={'bottom'}>
        <LikeFolderButton folder={folder} onlyShowOwned />
      </Tooltip>
      <Spacer size={'0.5rem'} />
      <Tooltip title={'Invite others to this folder'} defaultPlacement={'bottomLeft'}>
        <Contributors
          onClick={handleInviteUsers}
          users={[folder.creator, ...(folder?.members || [])]}
          displayLength='5'
          size='2rem'
        />
      </Tooltip>
    </ContainerRow>
  )
}

export default FolderActionToolbar
