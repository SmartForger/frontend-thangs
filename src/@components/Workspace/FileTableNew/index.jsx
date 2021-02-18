import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import cn from 'classnames'
import { format } from 'date-fns'
import { ContextMenuTrigger } from 'react-contextmenu'
import InfiniteTreeView from '@components/InfiniteTreeView'
import { SingleLineBodyText, MetadataSecondary, Contributors, Pill } from '@components'
import { flattenTree } from '@utilities/tree'
import { formatBytes } from '@utilities'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUpIcon } from '@svg/icon-arrow-up-sm.svg'
import { ReactComponent as ModelIcon } from '@svg/icon-model.svg'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as DropzoneIcon } from '@svg/dropzone.svg'
import { ReactComponent as DropzoneMobileIcon } from '@svg/dropzone-mobile.svg'
import Dropzone from 'react-dropzone'
import { MODEL_FILE_EXTS } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  return {
    FileTable_Body: {
      ...theme.mixins.scrollbar,
    },
    FileTable_FileRow: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    FileTable_HeaderRow: {
      display: 'flex',
      width: '100%',
      overflowY: 'scroll',
      ...theme.mixins.scrollbar,
    },
    FileTable_HeaderCell: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 'none',
      paddingRight: '1rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#000',
    },
    FileTable_Cell: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 'none',
      paddingRight: '1rem',
    },
    FileTable_SortOrder: {
      marginLeft: '0.25rem',
    },
    FileTable_FileName: {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
    },
    FileTable_Date: {
      width: '18%',
      justifyContent: 'center',
    },
    FileTable_Size: {
      width: '9%',
      justifyContent: 'center',
    },
    FileTable_Contributors: {
      width: '14%',
      display: 'flex',
      justifyContent: 'center',
    },
    FileTable_Action: {
      width: '7%',
    },
    FileTable_ExpandIcon: {
      width: '0.75rem',
      cursor: 'pointer',
      marginRight: '0.75rem',
      '& svg': {
        display: 'block',
        margin: 'auto',
        transition: 'transform 150ms ease-in-out',
      },
    },
    FileTable_ExpandIcon__expanded: {
      '& svg': {
        transform: 'rotate(90deg)',
      },
    },
    FileTable_AssemblyIcon: {
      marginRight: '0.5rem',
    },
    FileTable_MissingFile: {
      color: theme.colors.errorTextColor,
    },
  }
})

const noop = () => null
const handleMenuButton = e => {
  e.stopPropagation()
}

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

const SortByArrow = ({ order }) => {
  const c = useStyles()

  return order === 'asc' ? (
    <ArrowUpIcon className={c.FileTable_SortOrder} />
  ) : (
    <ArrowDownIcon className={c.FileTable_SortOrder} />
  )
}

const FileTableHeader = ({ sortedBy, order, onSort = () => {} }) => {
  const c = useStyles()

  return (
    <div className={c.FileTable_HeaderRow}>
      <MetadataSecondary
        className={cn(c.FileTable_FileName, c.FileTable_HeaderCell)}
        onClick={() => {
          onSort(COLUMNS.FILENAME)
        }}
      >
        Filename
        {sortedBy === COLUMNS.FILENAME && <SortByArrow order={order} />}
      </MetadataSecondary>
      <MetadataSecondary
        className={cn(c.FileTable_Date, c.FileTable_HeaderCell)}
        onClick={() => {
          onSort(COLUMNS.CREATED)
        }}
      >
        Created
        {sortedBy === COLUMNS.CREATED && <SortByArrow order={order} />}
      </MetadataSecondary>
      <MetadataSecondary
        className={cn(c.FileTable_Size, c.FileTable_HeaderCell)}
        onClick={() => {
          onSort(COLUMNS.SIZE)
        }}
      >
        Size
        {sortedBy === COLUMNS.SIZE && <SortByArrow order={order} />}
      </MetadataSecondary>
      <MetadataSecondary
        className={cn(c.FileTable_Contributors, c.FileTable_HeaderCell)}
        onClick={() => {
          onSort(COLUMNS.CONTRIBUTORS)
        }}
      >
        Contributors
        {sortedBy === COLUMNS.CONTRIBUTORS && <SortByArrow order={order} />}
      </MetadataSecondary>
      <div className={cn(c.FileTable_Action, c.FileTable_HeaderCell)} />
    </div>
  )
}

const FileTable = ({
  className,
  files = [],
  handleChangeFolder = noop,
  handleEditModel: _h = noop,
  sortedBy: initialSortedBy,
  searchCase,
  hideDropzone = false,
  onDrop = noop,
  heightOffset = 32,
}) => {
  const c = useStyles()
  const containerRef = useRef()
  const [maxHeight, setMaxHeight] = useState(300)
  const [{ sortedBy, order }, setSort] = useState({
    sortedBy: initialSortedBy || COLUMNS.FILENAME,
    order: 'desc',
  })

  const handleSort = useCallback(
    newSortedBy => {
      const newOrder = sortedBy !== newSortedBy ? 'asc' : order === 'asc' ? 'desc' : 'asc'

      setSort({ sortedBy: newSortedBy, order: newOrder })
    },
    [sortedBy, order]
  )

  const allNodes = useMemo(() => {
    let result = []

    const sorted = getSortedFiles(files, sortedBy, order)
    console.log(sorted)
    sorted.forEach(model => {
      if (model.parts) {
        const {
          created,
          aggregatorId,
          category,
          description,
          folderId,
          id,
          identifier,
          likeCount,
          owner,
        } = model
        model.parts[0] = {
          ...model.parts[0],
          created,
          aggregatorId,
          category,
          description,
          folderId,
          id,
          identifier,
          likeCount,
          contributors: [owner],
        }

        sortParts(model, sortedBy === COLUMNS.SIZE, order)
        const list = flattenTree(model.parts, 'parts')
        result = result.concat(list)
      } else {
        result.push({
          ...model,
          contributors: model.members,
          level: 0,
          isFolder: true,
        })
      }
    })

    return result
  }, [files, sortedBy, order])

  const renderNode = useCallback(
    (node, { toggleNode }) => {
      const menuProps = node.isFolder
        ? {
            id: 'Folder_Menu',
            attributes: {
              className: c.FileTable_FileRow,
            },
            collect: () => ({ folder: node }),
          }
        : node.level === 0
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

      return (
        <ContextMenuTrigger holdToDisplay={-1} {...menuProps}>
          <div
            className={cn(c.FileTable_FileRow, {
              [c.FileTable_MissingFile]: !node.valid,
            })}
          >
            <div
              className={cn(c.FileTable_FileName, c.FileTable_Cell)}
              style={{ paddingLeft: node.level * 24 }}
            >
              <div
                className={cn(c.FileTable_ExpandIcon, {
                  [c.FileTable_ExpandIcon__expanded]: !node.isLeaf && !node.closed,
                })}
                onClick={() => toggleNode(node)}
              >
                {node.isLeaf ? (
                  node.isFolder ? (
                    <FolderIcon />
                  ) : (
                    <ModelIcon />
                  )
                ) : (
                  <ArrowRight />
                )}
              </div>
              {!node.isLeaf && <FileIcon className={c.FileTable_AssemblyIcon} />}
              <SingleLineBodyText>{node.name}</SingleLineBodyText>
            </div>
            <MetadataSecondary className={cn(c.FileTable_Date, c.FileTable_Cell)}>
              {!node.created
                ? '-'
                : format(new Date(node.created), 'MMM d, y, h:mm aaaa')}
            </MetadataSecondary>
            <MetadataSecondary className={cn(c.FileTable_Size, c.FileTable_Cell)}>
              {!node.size ? '-' : formatBytes(node.size)}
            </MetadataSecondary>
            <div className={cn(c.FileTable_Contributors, c.FileTable_Cell)}>
              {!node.contributors ? '-' : <Contributors users={node.contributors} />}
            </div>
            <div
              className={cn(c.FileTable_Action, c.FileTable_Cell)}
              onClick={handleMenuButton}
            >
              <ContextMenuTrigger holdToDisplay={0} {...menuProps}>
                <DotStackIcon />
              </ContextMenuTrigger>
            </div>
          </div>
        </ContextMenuTrigger>
      )
    },
    [c]
  )

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMaxHeight(window.innerHeight - rect.top - heightOffset)
    }
  }, [heightOffset])

  return (
    <div className={className} ref={containerRef}>
      {allNodes.length > 0 || searchCase ? (
        <>
          <FileTableHeader sortedBy={sortedBy} onSort={handleSort} order={order} />

          {allNodes.length > 0 ? (
            <InfiniteTreeView
              classes={{
                root: c.FileTable_Body,
              }}
              maxHeight={maxHeight}
              itemHeight={60}
              levelPadding={0}
              nodes={allNodes}
              renderNode={renderNode}
              hideRowIcons
            />
          ) : (
            <SingleLineBodyText className={c.NoResultsFound}>
              No Results Found
            </SingleLineBodyText>
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
    </div>
  )
}

export default FileTable
