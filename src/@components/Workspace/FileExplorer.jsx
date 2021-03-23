import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as R from 'ramda'
import { Spacer, NavLink, Spinner } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ContextMenuTrigger } from 'react-contextmenu'

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
  folder = {},
  folderNav,
  isExpanded,
  parentName,
  parentKey,
  subfolders: originalSubfolders,
  handleChangeFolder = noop,
  level,
}) => {
  const c = useStyles({})
  const { id, name, subfolders = originalSubfolders } = folder
  const filteredSubfolders =
    subfolders && subfolders.length
      ? subfolders.filter(child => child.name.includes(name))
      : []
  const [showFolderContents, setShowFolderContents] = useState(false)
  const history = useHistory()
  const currentPath = history.location.pathname

  useEffect(() => {
    let timeout
    if (isExpanded) {
      timeout = setTimeout(() => {
        setShowFolderContents(true)
      }, 200)
    } else {
      timeout = setTimeout(() => {
        setShowFolderContents(false)
      }, 450)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isExpanded, setShowFolderContents])

  const shouldShowFolderContents = useMemo(() => showFolderContents || isExpanded, [
    isExpanded,
    showFolderContents,
  ])

  const handleNavLinkClick = useCallback(() => {
    handleChangeFolder(folder)
  }, [folder, handleChangeFolder])

  const folderName = parentName ? name.replace(`${parentName}//`, '') : name
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
          label={folderName}
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
            folders={filteredSubfolders}
            folderNav={folderNav}
            parentName={name}
            parentKey={parentKey}
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
  folders,
  folderNav,
  parentName,
  parentKey,
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
      {files.map((folder, index) => {
        const { id, name } = folder
        const isExpanded = folderNav[id]
        const newParentKey = parentKey ? `${parentKey}_${index}` : index
        const subfolders = folders.filter(folder => folder.name !== name)
        let folderName = name
        if (parentName) {
          folderName = folderName.replace(`${parentName}//`, '')
          if (folderName.includes('//')) return null
        }

        return (
          <div
            key={`folderKey_${newParentKey}`}
            className={classnames(c.FileExplorer_Subfolder, {
              [c.FileExplorer__open]: showFiles,
            })}
          >
            <Spacer size={'2rem'} />
            <div>
              <Folder
                folder={folder}
                folderNav={folderNav}
                parentName={parentName}
                parentKey={newParentKey}
                isExpanded={isExpanded}
                subfolders={subfolders}
                handleChangeFolder={handleChangeFolder}
                handleModelClick={handleModelClick}
                level={level}
              />
            </div>
          </div>
        )
      })}
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
    return folders.filter(folder => !folder.root && !folder.name.includes('//'))
  }, [folders])

  return (
    <Subfolders
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
  folders = [],
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

  if (!folders.length) return null

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
