import React, { useMemo, useCallback, useRef, useState } from 'react'
import cn from 'classnames'
import Dropzone from 'react-dropzone'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import { ContextMenuTrigger } from 'react-contextmenu'

import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Body,
  Metadata,
  MetadataType,
  Title,
  HeaderLevel,
} from '@physna/voxel-ui/@atoms/Typography'

import {
  ContainerColumn,
  ContainerRow,
  Contributors,
  FolderActionMenu,
  FolderActionToolbar,
  ModelActionMenu,
  ModelActionToolbar,
  Pill,
  Spacer,
  TableHeader,
  TreeView,
} from '@components'
import { formatBytes } from '@utilities'
import { MODEL_FILE_EXTS } from '@constants/fileUpload'
import { useIsFeatureOn, useOverlay } from '@hooks'

import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'
import { ReactComponent as AssemblyIcon } from '@svg/icon-assembly.svg'
import { ReactComponent as MultipartIcon } from '@svg/icon-multipart.svg'
import { ReactComponent as DropzoneIcon } from '@svg/dropzone.svg'
import { ReactComponent as DropzoneMobileIcon } from '@svg/dropzone-mobile.svg'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PrivateFolderIcon } from '@svg/icon-folder-private.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'
import { useExternalClick } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    FileTable_Body: {
      overflow: 'visible',
    },
    FileTable_Item: {
      borderBottom: `1px solid ${theme.colors.white[900]}`,
      overflow: 'visible',
      height: '3rem',
      '&:hover': {
        backgroundColor: theme.colors.white[600],
      },
    },
    FileTable_Item__selected: {
      backgroundColor: `${theme.colors.white[800]} !important`, //TODO: Design calls for a slightly diff. Need to update colors to reflect voxel.
    },
    FileTable_FileRow: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      height: '3rem',
      width: '100%',
    },
    FileTable_HeaderRow: {
      display: 'flex',
      overflowY: 'scroll',
      width: '100%',
      ...theme.mixins.scrollbar,
    },
    FileTable_HeaderCell: {
      alignItems: 'center',
      color: '#000',
      cursor: 'pointer',
      display: 'flex',
      flex: 'none',
      overflow: 'hidden',
      paddingRight: '1rem',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    FileTable_Cell: {
      display: 'flex',
      flex: 'none',
      paddingRight: '1rem',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    FileTable_SortOrder: {
      marginLeft: '0.25rem',
    },
    FileTable_FileName: {
      alignItems: 'center',
      overflow: 'hidden',
      display: 'flex',
      flex: '1',

      '& > span': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1rem',
      },
    },
    FileTable_Date: {
      justifyContent: 'left',
      width: '18%',
    },
    FileTable_Size: {
      justifyContent: 'left',
      width: '9%',
    },
    FileTable_Contributors: {
      display: 'flex',
      justifyContent: 'left',
      width: '14%',
    },
    FileTable_Action: {
      width: '7%',
    },
    FileTable_ExpandIcon: {
      cursor: 'pointer',
      width: '1.125rem',

      '& svg': {
        display: 'block',
        flex: 'none',
        margin: 'auto',
        transition: 'transform 150ms ease-in-out',
      },
    },
    FileTable_ExpandIcon__expanded: {
      '& svg': {
        transform: 'rotate(90deg)',
      },
    },
    FileTable_MissingFile: {
      color: theme.colors.errorTextColor,
    },
    NoResultsFound: {
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem',
    },
    NoFilesMessage: {
      left: '50%',
      position: 'absolute',
      top: '15.75rem',
      transform: 'translate(-50%)',
      [md]: {
        left: 'unset',
        margin: '2rem',
        padding: '2rem',
        position: 'relative',
        top: 'unset',
        transform: 'unset',
      },
      textAlign: 'center',
    },
    FileTable_UploadZone: {
      [md]: {
        margin: '0 auto',
        width: '27rem',
      },
      '& > div': {
        outline: 'none',
      },
    },
    FileTable_DropzoneIcon__mobile: {
      display: 'initial',
      [md]: {
        display: 'none',
      },
    },
    FileTable_DropzoneIcon__desktop: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
    FileTable_UploadButton: {
      bottom: '8rem',
      display: 'none',
      left: 0,
      margin: 'auto',
      position: 'absolute',
      right: 0,
      width: '5.25rem',
      [md]: {
        display: 'flex',
      },
    },
  }
})

const noop = () => null

const COLUMNS = {
  FILENAME: 'filename',
  CREATED: 'created',
  SIZE: 'size',
  CONTRIBUTORS: 'contributors',
}

const getCompareByOrder = (a, b, order) => {
  if (a < b) return order === 'asc' ? -1 : 1
  if (a > b) return order === 'asc' ? 1 : -1
  return 0
}

const getPrimaryModelSize = node => {
  if (node.size !== undefined) {
    return node.size || 0
  }

  if (node.parts) {
    const primaryPart = node.parts.find(part => part.isPrimary) || node.parts[0]
    if (primaryPart) {
      return primaryPart.size || 0
    }
  }

  return 0
}

const getSortedFiles = (files, sortType, order) => {
  return (
    [...files]
      .filter(file => file)
      .sort((a, b) => {
        if (sortType === COLUMNS.FILENAME) {
          return getCompareByOrder(
            (a.name || '').toUpperCase(),
            (b.name || '').toUpperCase(),
            order
          )
        }

        if (sortType === COLUMNS.CREATED) {
          return getCompareByOrder(
            new Date(a.created).getTime(),
            new Date(b.created).getTime(),
            order
          )
        }

        if (sortType === COLUMNS.SIZE) {
          return getCompareByOrder(getPrimaryModelSize(a), getPrimaryModelSize(b), order)
        }

        if (sortType === COLUMNS.CONTRIBUTORS) {
          return getCompareByOrder(
            (a.members || []).length,
            (b.members || []).length,
            order
          )
        }

        return 0
      })
      // folders always on top
      .sort((a, b) => {
        if (a.parts === undefined && b.parts !== undefined) {
          return -1
        }
        if (a.parts !== undefined && b.parts === undefined) {
          return 1
        }
        return 0
      })
  )
}

const sortParts = (node, sortBySize, sortOrder) => {
  if (node.parts) {
    node.parts.sort((a, b) => {
      if (!sortBySize) {
        const valA = a.isPrimary ? 2 : a.parts && a.parts.length > 0 ? 1 : 0
        const valB = b.isPrimary ? 2 : b.parts && b.parts.length > 0 ? 1 : 0

        return valB - valA
      }

      return sortOrder === 'asc' ? a.size - b.size : b.size - a.size
    })
    node.parts.forEach(a => {
      sortParts(a, sortBySize, sortOrder)
    })
  }
}

const addAdditionalInfoToSubparts = (nodes, info) => {
  return nodes.map(node => {
    if (node.parts) {
      node.parts = addAdditionalInfoToSubparts(node.parts, info)
    }

    return { ...node, ...info }
  })
}

const calcFileSize = file => {
  if (!file.parts) {
    return 0
  }

  return file.parts.reduce((sum, part) => sum + (part.size || 0) + calcFileSize(part), 0)
}

const FileTableHeader = ({ sortedBy, order, onSort = noop }) => {
  const c = useStyles()
  const colData = useMemo(
    () => [
      {
        key: COLUMNS.FILENAME,
        className: c.FileTable_FileName,
        title: 'Filename',
      },
      {
        key: COLUMNS.CREATED,
        className: c.FileTable_Date,
        title: 'Created',
      },
      {
        key: COLUMNS.SIZE,
        className: c.FileTable_Size,
        title: 'Size',
      },
      {
        key: COLUMNS.CONTRIBUTORS,
        className: c.FileTable_Contributors,
        title: 'Contributors',
      },
    ],
    [c]
  )

  return (
    <TableHeader
      columns={colData}
      sortBy={sortedBy}
      order={order}
      onSort={onSort}
      showContextMenus={true}
    />
  )
}

const FileTable = ({
  className,
  files = [],
  handleChangeFolder = noop,
  handleEditModel: _h = noop,
  onChange = noop,
  hideDropzone = false,
  onDrop = noop,
  searchCase,
  isToolbarShown = true,
  sortedBy: initialSortedBy,
  title,
  toolbarRef,
  hasSubtree = true,
}) => {
  const c = useStyles()
  const containerRef = useRef()
  const rowRef = useRef()
  const menuRef = useRef()
  const history = useHistory()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [{ sortedBy, order }, setSort] = useState({
    sortedBy: initialSortedBy || COLUMNS.FILENAME,
    order: 'desc',
  })
  const { isOverlayOpen } = useOverlay()
  const modelPageFeatureEnabled = useIsFeatureOn('mythangs_model_page_feature')

  const handleSort = useCallback(
    newSortedBy => {
      const newOrder = sortedBy !== newSortedBy ? 'asc' : order === 'asc' ? 'desc' : 'asc'

      setSort({ sortedBy: newSortedBy, order: newOrder })
    },
    [sortedBy, order]
  )

  const nodes = useMemo(() => {
    let result = getSortedFiles(files, sortedBy, order)

    const sortAndAddIdsToParts = nodes => {
      return nodes.map(node => {
        const newNode = { ...node }
        if (!newNode.id) {
          newNode.id = node.partIdentifier || Math.random().toString().slice(2)
        }

        if (newNode.parts) {
          newNode.parts = sortAndAddIdsToParts(newNode.parts)
          sortParts(newNode, sortedBy === COLUMNS.SIZE, order)
        }

        return newNode
      })
    }

    result = result.map(f => {
      if (f.parts) {
        return {
          ...f,
          contributors: [f.owner],
          size: calcFileSize(f),
          parts: hasSubtree
            ? addAdditionalInfoToSubparts(
              f.parts.length === 1 ? f.parts[0].parts || [] : f.parts,
              {
                created: f.created,
                contributors: [f.owner],
              }
            )
            : [],
          nodeType: f.isAssembly
            ? 'assembly'
            : f.parts.length > 1
              ? 'multipart'
              : 'singlepart',
        }
      }

      return { ...f, isFolder: true }
    })

    return sortAndAddIdsToParts(result)
  }, [files, hasSubtree, sortedBy, order])

  useExternalClick([rowRef, menuRef, toolbarRef], () => {
    if (!isOverlayOpen) {
      setSelectedFiles([])
      onChange({})
    }
  })

  const renderNode = useCallback(
    (node, level, expanded, toggleExpanded) => {
      const menuProps = node.isFolder
        ? {
          id: 'Folder_Menu',
          attributes: {
            className: c.FileTable_FileRow,
          },
          collect: () => ({ folder: node }),
        }
        : level === 0
          ? {
            id: 'File_Menu',
            attributes: {
              className: c.FileTable_FileRow,
            },
            collect: () => ({ model: node }),
          }
          : {
            id: 'Subpart_Menu',
            attributes: {
              className: c.FileTable_FileRow,
            },
            collect: () => ({ part: node }),
          }

      const handleClick = () => {
        setSelectedFiles([node.id])
        onChange(node)
      }

      const handleDoubleClick = () => {
        if (node.isFolder) {
          handleChangeFolder(node)
        } else if (modelPageFeatureEnabled) {
          const modelPath = `/mythangs/file/${node.id}`
          history.push(modelPath)
        } else {
          if (node?.identifier) history.push(node.identifier)
        }
      }

      const isSelected = selectedFiles.includes(node.id)
      const isLeaf = !node.parts || node.parts.length === 0
      const isFolder = level === 0 && !node.parts
      const showExpand = hasSubtree && !isLeaf
      return (
        <ContextMenuTrigger holdToDisplay={-1} {...menuProps}>
          <div
            className={cn(c.FileTable_FileRow, {
              [c.FileTable_MissingFile]: !node.valid,
            })}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            ref={isSelected ? rowRef : undefined}
          >
            <Spacer size={'.5rem'} />
            <div
              className={cn(c.FileTable_FileName, c.FileTable_Cell)}
              style={{ paddingLeft: level * 22 }}
            >
              {showExpand ? (
                <ContainerRow
                  className={cn(c.FileTable_ExpandIcon, {
                    [c.FileTable_ExpandIcon__expanded]: expanded && !isLeaf,
                  })}
                  onClick={ev => {
                    ev.stopPropagation()
                    toggleExpanded()
                  }}
                >
                  <ArrowRight />
                  <Spacer size={'.5rem'} />
                </ContainerRow>
              ) : (
                <Spacer size={'1.125rem'} />
              )}
              <ContainerRow>
                {isFolder ? (
                  node.isPublic ? (
                    <FolderIcon />
                  ) : (
                    <PrivateFolderIcon />
                  )
                ) : node.nodeType === 'assembly' ? (
                  <AssemblyIcon />
                ) : node.nodeType === 'multipart' ? (
                  <MultipartIcon />
                ) : !isLeaf ? (
                  <FileIcon />
                ) : (
                  <ModelIcon />
                )}
                <Spacer size={'.5rem'} />
              </ContainerRow>
              <Body>{node.name}</Body>
            </div>
            <Metadata
              type={MetadataType.secondary}
              className={cn(c.FileTable_Date, c.FileTable_Cell)}
            >
              {!node.created
                ? '-'
                : format(new Date(node.created), 'MMM d, y, h:mm aaaa')}
            </Metadata>
            <Metadata
              type={MetadataType.secondary}
              className={cn(c.FileTable_Size, c.FileTable_Cell)}
            >
              {!node.size ? '-' : formatBytes(node.size)}
            </Metadata>
            <div className={cn(c.FileTable_Contributors, c.FileTable_Cell)}>
              {!node.contributors ? '-' : <Contributors users={node.contributors} />}
            </div>
            <div className={cn(c.FileTable_Action, c.FileTable_Cell)}>
              {node.isFolder ? (
                <FolderActionMenu folder={node} />
              ) : (
                <ModelActionMenu model={node} isExpandedOptions />
              )}
            </div>
          </div>
        </ContextMenuTrigger>
      )
    },
    [
      c,
      handleChangeFolder,
      history,
      selectedFiles,
      modelPageFeatureEnabled,
      onChange,
      hasSubtree,
    ]
  )

  const isMultipart = files.length === 1 && files[0].parts && files[0].parts.length > 1
  const selectedNode = nodes.find(node => node.id === selectedFiles[0])
  const isSelectedNodeModel = node => {
    if (!node) return false
    return !node.isFolder
  }

  return (
    <>
      <ContainerColumn className={className} elementRef={containerRef} fullWidth>
        <ContainerRow
          fullWidth
          justifyContent={
            title && selectedNode && isToolbarShown
              ? 'space-between'
              : title
                ? 'flex-start'
                : 'flex-end'
          }
          elementRef={menuRef}
        >
          {title && (
            <ContainerRow>
              <Title headerLevel={HeaderLevel.tertiary}>{title}</Title>
              <Spacer size={'2rem'} />
            </ContainerRow>
          )}
          {selectedNode && isToolbarShown ? (
            isSelectedNodeModel(selectedNode) ? (
              <ModelActionToolbar model={selectedNode} isExpandedOptions />
            ) : (
              <FolderActionToolbar folder={selectedNode} isExpandedOptions />
            )
          ) : null}
        </ContainerRow>
        <Spacer size='1.375rem' />
        {files.length > 0 || searchCase ? (
          <>
            <FileTableHeader sortedBy={sortedBy} onSort={handleSort} order={order} />
            <Spacer size={'.5rem'} />
            {files.length > 0 ? (
              <TreeView
                nodes={nodes}
                subnodeField='parts'
                renderNode={renderNode}
                showDivider
                showExpandIcon={false}
                levelPadding={0}
                classes={{
                  item: c.FileTable_Item,
                  itemSelected: c.FileTable_Item__selected,
                  container: c.FileTable_Body,
                }}
                isSelected={node => selectedFiles.includes(node.id)}
                defaultExpanded={isMultipart}
              />
            ) : (
              <Body className={c.NoResultsFound}>No Results Found</Body>
            )}
          </>
        ) : !hideDropzone ? (
          <div className={c.NoFilesMessage}>
            <Dropzone onDrop={onDrop} accept={MODEL_FILE_EXTS} maxFiles={25}>
              {({ getRootProps, getInputProps }) => (
                <section className={c.FileTable_UploadZone}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <DropzoneIcon className={c.FileTable_DropzoneIcon__desktop} />
                    <DropzoneMobileIcon className={c.FileTable_DropzoneIcon__mobile} />
                    <Pill className={c.FileTable_UploadButton}>Browse</Pill>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        ) : null}
      </ContainerColumn>
    </>
  )
}

export default FileTable
