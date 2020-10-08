import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import { Spacer, NavLink, Spinner } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'

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
  handleModelClick = noop,
}) => {
  const c = useStyles({})
  const { id: folderId, name, subfolders = originalSubfolders, models } = folder
  const filteredSubfolders =
    subfolders && subfolders.length
      ? subfolders.filter(child => child.name.includes(name))
      : []
  const [showFolderContents, setShowFolderContents] = useState(false)

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        setShowFolderContents(true)
      }, 200)
    } else {
      setTimeout(() => {
        setShowFolderContents(false)
      }, 450)
    }
  }, [isExpanded, setShowFolderContents])

  const shouldShowFolderContents = useMemo(() => showFolderContents || isExpanded, [
    isExpanded,
    showFolderContents,
  ])

  const folderName = parentName ? name.replace(`${parentName}//`, '') : name

  return (
    <>
      <NavLink
        Icon={FolderIcon}
        label={folderName}
        isFolder={true}
        folderId={folderId}
        onClick={handleChangeFolder(folderId)}
      />
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
          />
          <Models
            models={models}
            showModels={showFolderContents && isExpanded}
            handleModelClick={handleModelClick}
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
        const { id: folderId, name } = folder
        const isExpanded = folderNav[folderId]
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
    />
  )
}

const Model = ({ model = {}, handleModelClick = noop }) => {
  const { id, name } = model
  const handleClick = useCallback(() => {
    handleModelClick(model)
  }, [handleModelClick, model])

  return (
    <NavLink
      Icon={FileIcon}
      label={name}
      isFolder={false}
      modelId={id}
      onClick={handleClick}
    />
  )
}

const Models = ({ models = [], showModels, handleModelClick = noop }) => {
  const c = useStyles({})
  const files = useMemo(() => {
    return !R.isEmpty(models)
      ? models.sort((a, b) => {
        if (a.name < b.name) return -1
        else if (a.name > b.name) return 1
        return 0
      })
      : []
  }, [models])
  return files.map((model, index) => {
    const { id } = model
    return (
      <div
        key={`model_${id}`}
        className={classnames(c.FileExplorer_Model, {
          [c.FileExplorer__open]: showModels,
        })}
      >
        <Spacer size={'2rem'} />
        <div>
          <Model
            key={`model_${index}`}
            model={model}
            handleModelClick={handleModelClick}
          />
        </div>
      </div>
    )
  })
}

const FileExplorer = ({
  folders = [],
  models = [],
  folderNav,
  isLoading,
  showFile,
  handleChangeFolder = noop,
  handleModelClick = noop,
}) => {
  const c = useStyles({})

  if (isLoading) {
    return <Spinner />
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
      <Models models={models} showModels={showFile} handleModelClick={handleModelClick} />
    </div>
  )
}

export default FileExplorer
