import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'

import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
} from '@physna/voxel-ui/@atoms/Typography'

import {
  ContainerColumn,
  ContainerRow,
  Contributors,
  LikeFolderButton,
  Spacer,
  ModelActionToolbar,
} from '@components'
import { useOverlay } from '@hooks'
import { buildPath } from '@utilities'

import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PadlockIcon } from '@svg/icon-padlock.svg'

const useStyles = createUseStyles(_theme => {
  return {
    FileHeader: {},
  }
})

const FileHeader = ({ file = {}, folders = [] }) => {
  const c = useStyles({})
  const { setOverlay } = useOverlay()
  const { folderId: id, name } = file
  const folderPath = useMemo(() => {
    const result = buildPath(folders, id, folder => ({
      label: folder.name,
      id: folder.id,
    }))

    result.push({
      id,
      label: R.pathOr('', [id, 'name'], folders),
    })

    return result
  }, [folders, id])

  const folder = folders[id] || {}
  const members = (folder && folder.members) || []

  const handleInviteUsers = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'inviteUsers',
      data: {
        folderId: id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [id, setOverlay])

  return (
    <ContainerRow alignItems={'center'} justifyContent={'space-between'}>
      <ContainerRow alignItems={'center'}>
        <FolderIcon />
        <Spacer size={'1rem'} />
        <ContainerColumn>
          <ContainerRow>
            <Title headerLevel={HeaderLevel.tertiary}>{name}</Title>
            <Spacer size={'.5rem'} />
            {folder && folder.isPublic && (
              <>
                <PadlockIcon className={c.PadlockIcon_Header} />
                <Spacer size={'.25rem'} />
              </>
            )}
            <LikeFolderButton folder={folder} minimal onlyShowOwned />
          </ContainerRow>
          {folderPath.length > 1 && (
            <>
              <Spacer size={'.5rem'} />
              <Metadata type={MetadataType.primary}>
                {folderPath.map((pathObj, index) => {
                  if (index === folderPath.length - 1) return null
                  return (
                    <React.Fragment key={`folderCrumb_${pathObj.id}`}>
                      <Link
                        to={`/mythangs/folder/${pathObj.id}`}
                      >{`${pathObj.label}`}</Link>
                      {index !== folderPath.length - 2 && <>&nbsp;&nbsp;/&nbsp;&nbsp;</>}
                    </React.Fragment>
                  )
                })}
              </Metadata>
            </>
          )}
        </ContainerColumn>
      </ContainerRow>
      <ContainerRow alignItems={'center'}>
        <Contributors
          users={R.isEmpty(folder) ? [] : [folder.creator, ...members]}
          displayLength='10'
          onClick={handleInviteUsers}
        />
        <Spacer size={'1rem'} />
        <ModelActionToolbar model={file} isExpandedOptions />
      </ContainerRow>
    </ContainerRow>
  )
}

FileHeader.displayName = 'FileHeader'

export default FileHeader
