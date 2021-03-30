import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as R from 'ramda'
import { Spacer, NavLink, Spinner } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ContextMenuTrigger } from 'react-contextmenu'
import { getRootFolders, getSubFolders } from '@selectors'

const useStyles = createUseStyles(_theme => {
  return {
    FileExplorer: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      alignItems: 'baseline',
      transition: 'all 450ms ease-in-out',
      maxHeight: 0,
      overflow: 'hidden',
      height: 'auto',

      '& > div': {
        flex: 'none',
      },
    },
    FileExplorer_Subfolder: {
      display: 'flex',
      transition: 'all 450ms ease-in-out',
      maxHeight: 0,
      overflow: 'hidden',
      height: 'auto',
    },
    FileExplorer_Model: {
      display: 'flex',
      transition: 'all 450ms ease-in-out',
      maxHeight: 0,
      overflow: 'hidden',
      height: 'auto',
    },
    FileExplorer__open: {
      maxHeight: '100rem',
    },
  }
})

const noop = () => null

const Folder = ({
  allFolders = {},
  folder = {},
  folderNav,
  isExpanded,
  handleChangeFolder = noop,
  level,
}) => {
  const c = useStyles({})
  const { id, name } = folder
  const filteredSubfolders = getSubFolders(allFolders, id)
  const [showFolderContents, setShowFolderContents] = useState(false)
  const history = useHistory()
  const currentPath = history.location.pathname

  useEffect(() => {
    if (isExpanded) {
      setShowFolderContents(true)
    } else {
      setShowFolderContents(false)
    }
  }, [isExpanded, setShowFolderContents])

  const shouldShowFolderContents = useMemo(() => showFolderContents || isExpanded, [
    isExpanded,
    showFolderContents,
  ])

  const handleNavLinkClick = useCallback(() => {
    handleChangeFolder(folder)
  }, [folder, handleChangeFolder])

  const isIconDisabled = R.isEmpty(filteredSubfolders)
  return (
    <>
      <ContextMenuTrigger
        id={'Folder_Menu'}
        collect={() => ({ folder })}
        holdToDisplay={-1}
      >
        <NavLink
          Icon={FolderIcon}
          label={name}
          isFolder={true}
          folderId={id}
          onClick={handleNavLinkClick}
          selected={currentPath === `/mythangs/folder/${id}`}
          level={level}
          isIconDisabled={isIconDisabled}
        />
      </ContextMenuTrigger>
      <Spacer size={'1rem'} />
      {shouldShowFolderContents && (
        <div className={c.FileExplorer_Folder}>
          <Subfolders
            allFolders={allFolders}
            folders={filteredSubfolders}
            folderNav={folderNav}
            showFiles={showFolderContents && isExpanded}
            handleChangeFolder={handleChangeFolder}
            level={level + 1}
          />
        </div>
      )}
    </>
  )
}

const Subfolders = ({
  allFolders,
  folders,
  folderNav,
  showFiles,
  handleChangeFolder = noop,
  handleModelClick = noop,
  level,
}) => {
  const c = useStyles({})
  const files = useMemo(() => {
    return !R.isEmpty(folders)
      ? folders.sort((a, b) => {
          if (a.name < b.name) return -1
          else if (a.name > b.name) return 1
          return 0
        })
      : []
  }, [folders])

  return (
    <>
      {files.map(folder => (
        <div
          key={`folderKey_${folder.id}`}
          className={classnames(c.FileExplorer_Subfolder, {
            [c.FileExplorer__open]: showFiles,
          })}
        >
          <Spacer size={'2rem'} />
          <div>
            <Folder
              allFolders={allFolders}
              folder={folder}
              folderNav={folderNav}
              isExpanded={folderNav[folder.id]}
              handleChangeFolder={handleChangeFolder}
              handleModelClick={handleModelClick}
              level={level}
            />
          </div>
        </div>
      ))}
    </>
  )
}

const RootFolders = ({
  folders,
  folderNav,
  handleChangeFolder = noop,
  handleModelClick = noop,
}) => {
  const filteredRootFolders = useMemo(() => {
    return getRootFolders(folders)
  }, [folders])

  return (
    <Subfolders
      allFolders={folders}
      folders={filteredRootFolders}
      folderNav={folderNav}
      showFiles={true}
      handleChangeFolder={handleChangeFolder}
      handleModelClick={handleModelClick}
      level={0}
    />
  )
}

const FileExplorer = ({
  folders = {},
  models: _m = [],
  folderNav,
  isLoading,
  showFile,
  handleChangeFolder = noop,
  handleModelClick = noop,
}) => {
  const c = useStyles({})

  if (isLoading) {
    return (
      <>
        <Spinner />
        <Spacer size={'2rem'} />
      </>
    )
  }

  if (R.isEmpty(folders)) return null

  return (
    <div className={classnames(c.FileExplorer, { [c.FileExplorer__open]: showFile })}>
      <RootFolders
        folders={folders}
        folderNav={folderNav}
        handleChangeFolder={handleChangeFolder}
        handleModelClick={handleModelClick}
      />
      <Spacer size={'.5rem'} />
    </div>
  )
}

export default FileExplorer
