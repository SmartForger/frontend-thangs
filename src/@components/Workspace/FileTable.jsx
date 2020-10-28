import React, { useCallback, useState, useRef, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Contributors,
  FileContextMenu,
  FileMenu,
  Pill,
  SingleLineBodyText,
  Spacer,
} from '@components'
import { createUseStyles } from '@style'
import { MetadataSecondary } from '@components/Text/Metadata'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUpIcon } from '@svg/icon-arrow-up-sm.svg'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as DropzoneIcon } from '@svg/dropzone.svg'
import { formatBytes } from '@utilities'
import { ContextMenuTrigger } from 'react-contextmenu'
import { useExternalClick } from '@hooks'
import Dropzone from 'react-dropzone'
import { MODEL_FILE_EXTS } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  return {
    FileTable: {
      width: '100%',
      '& table': {
        borderCollapse: 'collapse',
        width: '100%',
        cursor: 'default',
      },
      '& th': {
        fontSize: '.75rem',
        padding: '0rem .25rem 1rem',
        textAlign: 'left',
        textTransform: 'uppercase',
      },
      '& th span': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        textTransform: 'capitalize',
        color: theme.colors.black[500],
      },
      '& td': {
        padding: '1rem .5rem',
        fontSize: '.875rem',
      },
      '& td span': {
        maxWidth: '15rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1rem',
      },
      '& tbody tr': {
        padding: 0,
        margin: 0,
        border: 'none',
        borderBottom: `1px solid ${theme.colors.white[900]}`,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    FileTable_Header__cursor: {
      cursor: 'pointer',
    },
    FileTable_Row: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
    },
    FileTable_Cell: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      cursor: 'pointer',
      width: '20%',

      '& svg': {
        flex: 'none',
      },
    },
    FileTable_Action: {
      width: 'auto',
      justifyContent: 'flex-end',
      flex: 1,
    },
    FileTable_FileName: {
      width: '40%',
      maxWidth: '14rem',
      marginLeft: '1rem',

      '& span': {
        overflow: 'hidden',
        marginRight: '2rem',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        lineHeight: '1rem',
      },
    },
    FileTable_Size: {
      width: '10%',
    },
    NoFilesMessage: {
      margin: '2rem',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
    },
    NoFilesMessage_Icon: {
      position: 'relative',
    },
    NoFilesMessage_Text: {
      justifyContent: 'center',
    },
    FileCard_UploadIcon: {
      position: 'absolute',
      bottom: '3rem',
      left: 0,
      right: 0,
      width: '100%',

      '& path': {
        fill: '#AE881E',
        stroke: '#AE881E',
      },
    },
    NoResultsFound: {
      display: 'flex',
      padding: '2rem',
      justifyContent: 'center',
    },
    MenuButton: {
      padding: '0 .5rem',
      position: 'relative',
    },
    FileRowMenu: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
    },
    FileTable_UploadZone: {
      width: '27rem',
      margin: '0 auto',

      '& > div': {
        outline: 'none',
      },
    },
    FileTable_UploadButton: {
      width: '5.25rem',
      position: 'absolute',
      bottom: '8rem',
      left: 0,
      right: 0,
      margin: 'auto',
    },
  }
})

const noop = () => null

const COLUMNS = {
  FILENAME: 'filename',
  CREATED: 'created',
  FILETYPE: 'filetype',
  SIZE: 'size',
  CONTRIBUTORS: 'contributors',
}

const FileName = ({ name }) => {
  const c = useStyles({})
  return (
    <div className={c.FileTable_Row}>
      <FileIcon />
      <Spacer size={'.5rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </div>
  )
}

const FolderName = ({ name }) => {
  const c = useStyles({})
  return (
    <div className={c.FileTable_Row}>
      <FolderIcon />
      <Spacer size={'.5rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </div>
  )
}

const SortByArrow = ({ order }) => {
  return (
    <>
      <Spacer size={'.25rem'} />
      {order === 'asc' ? <ArrowDownIcon /> : <ArrowUpIcon />}
    </>
  )
}

const FileTableHeader = ({ sortedBy, order, onSort = () => {} }) => {
  const c = useStyles({})

  return (
    <thead>
      <tr>
        <th>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.FILENAME)
            }}
          >
            Filename{sortedBy === COLUMNS.FILENAME && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.CREATED)
            }}
          >
            Created{sortedBy === COLUMNS.CREATED && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.FILETYPE)
            }}
          >
            File Type{sortedBy === COLUMNS.FILETYPE && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.SIZE)
            }}
          >
            Size{sortedBy === COLUMNS.SIZE && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.CONTRIBUTORS)
            }}
          >
            Contributors
            {sortedBy === COLUMNS.CONTRIBUTORS && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th>
          <MetadataSecondary>Versioned From</MetadataSecondary>
        </th>
        <th></th>
      </tr>
    </thead>
  )
}

const FolderRow = ({ folder }) => {
  const c = useStyles({})
  const [showFolderMenu, setShowFolderMenu] = useState(false)
  const folderMenuRef = useRef(null)

  useExternalClick(folderMenuRef, () => setShowFolderMenu(false))

  const handleFolderMenu = useCallback(
    e => {
      e.stopPropagation()
      setShowFolderMenu(!showFolderMenu)
    },
    [showFolderMenu]
  )

  return (
    <>
      <td title={folder.name}>
        <FolderName name={folder.name} />
      </td>
      <td>
        <MetadataSecondary>-</MetadataSecondary>
      </td>
      <td>
        <MetadataSecondary>-</MetadataSecondary>
      </td>
      <td>
        <MetadataSecondary>-</MetadataSecondary>
      </td>
      <td>
        <Contributors users={folder.members} />
      </td>
      <td>-</td>
      <td>
        <div className={c.MenuButton} onClick={handleFolderMenu} ref={folderMenuRef}>
          <DotStackIcon />
          {showFolderMenu && (
            <div className={c.FileRowMenu}>
              <FileMenu folder={folder} type={'folder'} />
            </div>
          )}
        </div>
      </td>
    </>
  )
}

const FileRow = ({ model, handleModelClick: _handle = noop }) => {
  const c = useStyles({})
  const [showFileMenu, setShowFileMenu] = useState(false)
  const fileMenuRef = useRef(null)

  useExternalClick(fileMenuRef, () => setShowFileMenu(false))

  const handleFileMenu = useCallback(
    e => {
      e.stopPropagation()
      setShowFileMenu(!showFileMenu)
    },
    [showFileMenu]
  )

  return (
    <>
      <td>
        <FileName name={model.name} />
      </td>
      <td>
        <MetadataSecondary>
          {format(new Date(model.uploadDate), 'MMM d, Y, h:mm aaaa')}
        </MetadataSecondary>
      </td>
      <td>
        <MetadataSecondary>{model.fileType}</MetadataSecondary>
      </td>
      <td>
        <MetadataSecondary>{formatBytes(model.size)}</MetadataSecondary>
      </td>
      <td>
        <Contributors users={[model.owner]} />
      </td>
      <td>
        {model.previousVersionModelId ? (
          <Link to={`/model/${model.previousVersionModelId}`}>
            {model.previousVersionModelId}
          </Link>
        ) : (
          '-'
        )}
      </td>
      <td>
        <div className={c.MenuButton} onClick={handleFileMenu} ref={fileMenuRef}>
          <DotStackIcon />
          {showFileMenu && (
            <div className={c.FileRowMenu}>
              <FileMenu model={model} type={'model'} />
            </div>
          )}
        </div>
      </td>
    </>
  )
}

const getCompareByOrder = (a, b, order) => {
  if (a < b) return order === 'asc' ? -1 : 1
  if (a > b) return order === 'asc' ? 1 : -1
  return 0
}

const getSortedFiles = (files, sortType, order) => {
  return [...files].sort((a, b) => {
    if (sortType === COLUMNS.FILENAME) {
      return getCompareByOrder(
        (a.name || '').toUpperCase(),
        (b.name || '').toUpperCase(),
        order
      )
    }

    if (sortType === COLUMNS.CREATED) {
      return getCompareByOrder(
        new Date(a.uploadDate).getTime(),
        new Date(b.uploadDate).getTime(),
        order
      )
    }

    if (sortType === COLUMNS.SIZE) {
      return getCompareByOrder(a.size, b.size, order)
    }

    if (sortType === COLUMNS.FILETYPE) {
      return getCompareByOrder(
        (a.fileType || '').toUpperCase(),
        (b.fileType || '').toUpperCase(),
        order
      )
    }

    if (sortType === COLUMNS.CONTRIBUTORS) {
      return getCompareByOrder((a.members || []).length, (b.members || []).length, order)
    }

    return 0
  })
}

const FileTable = ({
  files = [],
  handleChangeFolder = noop,
  handleEditModel = noop,
  sortedBy: initialSortedBy,
  searchCase,
  hideDropzone = false,
  onDrop = noop,
}) => {
  const c = useStyles({})
  const history = useHistory()

  const [{ sortedBy, order }, setSort] = useState({
    sortedBy: initialSortedBy || COLUMNS.FILENAME,
    order: 'desc',
  })
  const handleSort = useCallback(
    sortedBy => {
      setSort({ sortedBy, order: order === 'asc' ? 'desc' : 'asc' })
    },
    [order]
  )
  const sortedFiles = useMemo(() => {
    return getSortedFiles(files, sortedBy, order)
  }, [files, order, sortedBy])

  return (
    <div className={c.FileTable}>
      {sortedFiles.length > 0 || searchCase ? (
        <>
          <table>
            <FileTableHeader sortedBy={sortedBy} onSort={handleSort} order={order} />
            <tbody>
              {sortedFiles.length > 0 ? (
                sortedFiles.map((file, index) => {
                  if (!file) return null
                  const { id } = file
                  const handleClick = file.subfolders
                    ? () => handleChangeFolder(file)
                    : () => {
                      history.push(`/model/${file.id}`)
                    }
                  const RowWithProps = ({ children, ...props }) => (
                    <tr onClick={handleClick} {...props}>
                      {children}
                    </tr>
                  )
                  return (
                    <React.Fragment key={`TableRow_${index}`}>
                      {file.subfolders ? (
                        <React.Fragment key={`FolderRow_${index}`}>
                          <ContextMenuTrigger
                            id={`File_Menu_${id}`}
                            holdToDisplay={1000}
                            renderTag={RowWithProps}
                          >
                            <FolderRow folder={file} />
                          </ContextMenuTrigger>
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={`FileRow_${index}`}>
                          <ContextMenuTrigger
                            id={`File_Menu_${id}`}
                            holdToDisplay={1000}
                            renderTag={RowWithProps}
                          >
                            <FileRow model={file} handleModelClick={handleEditModel} />
                          </ContextMenuTrigger>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <SingleLineBodyText className={c.NoResultsFound}>
                  No Results Found
                </SingleLineBodyText>
              )}
            </tbody>
          </table>
          {sortedFiles.length > 0
            ? sortedFiles.map((file, index) => {
              if (!file) return null
              const { id, subfolders } = file
              return subfolders ? (
                <FileContextMenu
                  key={`contextMenu_${index}`}
                  id={id}
                  folder={file}
                  type={'folder'}
                />
              ) : (
                <FileContextMenu
                  key={`contextMenu_${index}`}
                  id={id}
                  model={file}
                  type={'model'}
                />
              )
            })
            : null}
        </>
      ) : !hideDropzone ? (
        <div className={c.NoFilesMessage}>
          <Dropzone onDrop={onDrop} accept={MODEL_FILE_EXTS} maxFiles={25}>
            {({ getRootProps, getInputProps }) => (
              <section className={c.FileTable_UploadZone}>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <DropzoneIcon />
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
