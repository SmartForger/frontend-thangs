import React, { useCallback, useState, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as R from 'ramda'
import { ContextMenuTrigger } from 'react-contextmenu'
import { format } from 'date-fns'
import classnames from 'classnames'
import { Contributors, Pill, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MetadataSecondary } from '@components/Text/Metadata'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowUpIcon } from '@svg/icon-arrow-up-sm.svg'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as DropzoneIcon } from '@svg/dropzone.svg'
import { ReactComponent as DropzoneMobileIcon } from '@svg/dropzone-mobile.svg'
import { formatBytes } from '@utilities'
import Dropzone from 'react-dropzone'
import { MODEL_FILE_EXTS } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    FileTable: {
      width: '100%',
      overflowY: 'hidden',
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
    FileTable_Header: {
      minWidth: '5rem',
    },
    FileTable_Row: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
    },
    FileTable_Row_Column: {
      minWidth: '5rem',
    },
    FileTable_Row_Column_Uploaded: {
      textAlign: 'left',
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
      top: '15.75rem',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%)',
      [md]: {
        position: 'relative',
        margin: '2rem',
        padding: '2rem',
        top: 'unset',
        left: 'unset',
        transform: 'unset',
      },
      textAlign: 'center',
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
      cursor: 'pointer',

      '& > svg': {
        padding: '.25rem',
        borderRadius: '.25rem',
        border: '1px solid transparent',

        '&:hover': {
          border: `1px solid ${theme.colors.grey[300]}`,
        },
      },
    },
    FileRowMenu: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
    },
    FileTable_UploadZone: {
      [md]: {
        width: '27rem',
        margin: '0 auto',
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
      width: '5.25rem',
      position: 'absolute',
      bottom: '8rem',
      left: 0,
      right: 0,
      margin: 'auto',
      display: 'none',
      [md]: {
        display: 'flex',
      },
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
        <th className={c.FileTable_Header}>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.CREATED)
            }}
          >
            Created{sortedBy === COLUMNS.CREATED && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th className={c.FileTable_Header}>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.FILETYPE)
            }}
          >
            File Type{sortedBy === COLUMNS.FILETYPE && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th className={c.FileTable_Header}>
          <MetadataSecondary
            className={c.FileTable_Header__cursor}
            onClick={() => {
              onSort(COLUMNS.SIZE)
            }}
          >
            Size{sortedBy === COLUMNS.SIZE && <SortByArrow order={order} />}
          </MetadataSecondary>
        </th>
        <th className={c.FileTable_Header}>
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
        <th className={c.FileTable_Header}>
          <MetadataSecondary>Versioned From</MetadataSecondary>
        </th>
        <th className={c.FileTable_Header}></th>
      </tr>
    </thead>
  )
}

const FolderRow = ({ folder }) => {
  const c = useStyles({})

  return (
    <>
      <td title={folder.name} className={c.FileTable_Row_Column}>
        <FolderName name={folder.name} />
      </td>
      <td className={c.FileTable_Row_Column}>
        <MetadataSecondary>-</MetadataSecondary>
      </td>
      <td className={c.FileTable_Row_Column}>
        <MetadataSecondary>-</MetadataSecondary>
      </td>
      <td className={c.FileTable_Row_Column}>
        <MetadataSecondary>-</MetadataSecondary>
      </td>
      <td className={c.FileTable_Row_Column}>
        <Contributors users={folder.members} />
      </td>
      <td className={c.FileTable_Row_Column}>-</td>
      <td className={c.FileTable_Row_Column}>
        <div className={c.MenuButton} onClick={handleMenuButton}>
          <ContextMenuTrigger
            id={'Folder_Menu'}
            holdToDisplay={0}
            collect={() => ({ folder })}
          >
            <DotStackIcon />
          </ContextMenuTrigger>
        </div>
      </td>
    </>
  )
}

const FileRow = ({ model }) => {
  const c = useStyles({})
  // This is to safe-guard against an issue where model comes back as an
  // empty object from api-platform, not an expected behavior. - BE
  if (!model || R.isEmpty(model)) return null
  return (
    <>
      <td className={c.FileTable_Row_Column}>
        <FileName name={model.name} />
      </td>
      <td className={c.FileTable_Row_Column}>
        <MetadataSecondary className={c.FileTable_Row_Column_Uploaded}>
          {R.isNil(model.created)
            ? '-'
            : format(new Date(model.created), 'MMM d, Y, h:mm aaaa')}
        </MetadataSecondary>
      </td>
      <td className={c.FileTable_Row_Column}>
        <MetadataSecondary>{model.fileType}</MetadataSecondary>
      </td>
      <td className={c.FileTable_Row_Column}>
        <MetadataSecondary>
          {R.isNil(model.size) ? '-' : formatBytes(model.size)} {}
        </MetadataSecondary>
      </td>
      <td className={c.FileTable_Row_Column}>
        <Contributors users={[model.owner]} />
      </td>
      <td className={c.FileTable_Row_Column}>
        {model.previousVersionModelId ? (
          <Link to={`/model/${model.previousVersionModelId}`}>
            {model.previousVersionModelId}
          </Link>
        ) : (
          '-'
        )}
      </td>
      <td className={c.FileTable_Row_Column}>
        <div className={c.MenuButton} onClick={handleMenuButton}>
          <ContextMenuTrigger
            id={'File_Menu'}
            collect={() => ({ model })}
            holdToDisplay={0}
          >
            <DotStackIcon />
          </ContextMenuTrigger>
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
        if (a.fileType === undefined && b.fileType !== undefined) {
          return -1
        }
        if (a.fileType !== undefined && b.fileType === undefined) {
          return 1
        }
        return 0
      })
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
}) => {
  const c = useStyles({})
  const history = useHistory()

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
  const sortedFiles = useMemo(() => {
    return getSortedFiles(files, sortedBy, order)
  }, [files, order, sortedBy])

  return (
    <div className={classnames(className, c.FileTable)}>
      {sortedFiles.length > 0 || searchCase ? (
        <>
          <table>
            <FileTableHeader sortedBy={sortedBy} onSort={handleSort} order={order} />
            <tbody>
              {sortedFiles.length > 0 ? (
                sortedFiles.map((file, index) => {
                  if (!file) return null
                  return (
                    <React.Fragment key={`TableRow_${index}`}>
                      {R.isNil(file.models) ? (
                        <React.Fragment key={`FileRow_${index}`}>
                          <ContextMenuTrigger
                            id={'File_Menu'}
                            holdToDisplay={-1}
                            renderTag={'tr'}
                            attributes={{
                              onClick: () => history.push(`/model/${file.id}`),
                            }}
                            collect={() => ({ model: file })}
                          >
                            <FileRow model={file} />
                          </ContextMenuTrigger>
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={`FolderRow_${index}`}>
                          <ContextMenuTrigger
                            id={'Folder_Menu'}
                            holdToDisplay={-1}
                            renderTag={'tr'}
                            attributes={{
                              onClick: () => handleChangeFolder(file),
                            }}
                            collect={() => ({ folder: file })}
                          >
                            <FolderRow folder={file} />
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
