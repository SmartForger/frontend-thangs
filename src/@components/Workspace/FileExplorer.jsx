import React, { useEffect, useMemo, useState } from 'react'
import { Spacer, NavLink, Spinner } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { authenticationService } from '@services'
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
    FileExplorer__open: {
      maxHeight: '100rem',
    },
    FileExplorer_Model: {
      display: 'flex',
    },
  }
})

const Folder = ({
  folder = {},
  folderNav,
  isExpanded,
  parentName,
  parentKey,
  subfolders: originalSubfolders,
  models,
}) => {
  const c = useStyles({})
  const { id: folderId, name, subfolders = originalSubfolders } = folder
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
      <NavLink Icon={FolderIcon} label={folderName} isFolder={true} folderId={folderId} />
      <Spacer size={'1rem'} />
      {shouldShowFolderContents && (
        <div className={c.FileExplorer_Folder}>
          <Subfolders
            folders={filteredSubfolders}
            folderNav={folderNav}
            models={models}
            parentName={name}
            parentKey={parentKey}
            showFiles={showFolderContents && isExpanded}
          />
          <Models models={models} />
        </div>
      )}
    </>
  )
}

const Subfolders = ({ folders, folderNav, parentName, parentKey, showFiles }) => {
  const c = useStyles({})
  return (
    <>
      {folders.map((folder, index) => {
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
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

const RootFolders = ({ folders, folderNav, models }) => {
  const filteredRootFolders = useMemo(() => {
    return folders.filter(folder => !folder.root && !folder.name.includes('//'))
  }, [folders])

  return (
    <Subfolders
      folders={filteredRootFolders}
      folderNav={folderNav}
      models={models}
      showFiles={true}
    />
  )
}

const Model = ({ model = {} }) => {
  const { id, name } = model
  return <NavLink Icon={FileIcon} label={name} isFolder={false} modelId={id} />
}

const Models = ({ models = [] }) => {
  const c = useStyles({})
  return models.map((model, index) => {
    const { id } = model
    return (
      <div key={`model_${id}`} className={c.FileExplorer_Model}>
        <Spacer size={'2rem'} />
        <div>
          <Model key={`model_${index}`} model={model} />
        </div>
      </div>
    )
  })
}

const FileExplorer = ({
  folders = [],
  models = [],
  folderNav,
  showOwned = true,
  isLoading,
  showFile,
}) => {
  const c = useStyles({})
  const currentUserId = authenticationService.getCurrentUserId()
  const filteredFolders = useMemo(() => {
    if (showOwned) return folders.filter(({ creator }) => creator === currentUserId)
    return folders.filter(({ creator }) => creator !== currentUserId)
  }, [currentUserId, folders, showOwned])

  if (isLoading) {
    return <Spinner />
  }

  if (!folders.length) return null

  return (
    <div className={classnames(c.FileExplorer, { [c.FileExplorer__open]: showFile })}>
      <RootFolders folders={filteredFolders} folderNav={folderNav} models={models} />
      <Models models={models} />
    </div>
  )
}

export default FileExplorer
