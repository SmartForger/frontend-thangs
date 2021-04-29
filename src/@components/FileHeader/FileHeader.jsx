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
  Spacer,
  ModelActionToolbar,
} from '@components'
import { useOverlay } from '@hooks'
import { buildPath } from '@utilities'

import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PrivateFolderIcon } from '@svg/icon-folder-private.svg'

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
  const { members = [] } = folder

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
    <>
      <ContainerRow justifyContent={'space-between'}>
        <ContainerRow>
          <ContainerColumn>
            <Spacer size={'.5rem'} />
            {folder.isPublic ? <FolderIcon /> : <PrivateFolderIcon />}
          </ContainerColumn>
          <Spacer size={'1rem'} />
          <ContainerColumn>
            <ContainerRow alignItems={'center'}>
              <div className={c.FolderView_RootLink}>
                <Title headerLevel={HeaderLevel.tertiary}>{name}</Title>
              </div>
              <Spacer size={'2rem'} />
            </ContainerRow>
            {folderPath.length > 1 && (
              <>
                <Metadata type={MetadataType.primary}>
                  {folderPath.map((pathObj, index) => {
                    if (index === folderPath.length - 1) return null
                    return (
                      <React.Fragment key={`folderCrumb_${pathObj.id}`}>
                        <Link
                          to={`/mythangs/folder/${pathObj.id}`}
                        >{`${pathObj.label}`}</Link>
                        {index !== folderPath.length - 2 && (
                          <>&nbsp;&nbsp;/&nbsp;&nbsp;</>
                        )}
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
    </>
  )
}

FileHeader.displayName = 'FileHeader'

export default FileHeader
