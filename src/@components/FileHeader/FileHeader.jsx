import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ContextMenuTrigger } from 'react-contextmenu'
import * as R from 'ramda'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Pill,
  ContainerColumn,
  ContainerRow,
  Contributors,
  LikeFolderButton,
  MetadataPrimary,
  Spacer,
  TitleTertiary,
} from '@components'
import { useOverlay } from '@hooks'
import { buildPath } from '@utilities'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PadlockIcon } from '@svg/icon-padlock.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload-black.svg'

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
  const members = folder && folder.members

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

  const handleNewVersion = useCallback(
    e => {
      e.preventDefault()
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          model: file,
          action: 'update',
        },
      })
    },
    [file, setOverlay]
  )

  return (
    <ContainerRow alignItems={'center'} justifyContent={'space-between'}>
      <ContainerRow alignItems={'center'}>
        <FolderIcon />
        <Spacer size={'1rem'} />
        <ContainerColumn>
          <ContainerRow>
            <TitleTertiary>{name}</TitleTertiary>
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
              <MetadataPrimary>
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
              </MetadataPrimary>
            </>
          )}
        </ContainerColumn>
      </ContainerRow>
      <ContainerRow alignItems={'center'}>
        <Contributors users={members} displayLength='10' onClick={handleInviteUsers} />
        <Spacer size={'1rem'} />
        <Pill onClick={handleNewVersion}>
          <UploadIcon />
          <Spacer size={'.5rem'} />
          New version
        </Pill>
        <Spacer size='.5rem' />
        <div onClick={e => e.preventDefault()}>
          <ContextMenuTrigger
            id={'File_Menu'}
            holdToDisplay={-1}
            collect={() => ({ model: file })}
          >
            <DotStackIcon />
          </ContextMenuTrigger>
        </div>
      </ContainerRow>
    </ContainerRow>
  )
}

FileHeader.displayName = 'FileHeader'

export default FileHeader
