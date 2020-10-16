import React, { useCallback, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Contributors,
  Divider,
  FileContextMenu,
  FileMenu,
  Pill,
  SingleLineBodyText,
  Spacer,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { MetadataSecondary } from '@components/Text/Metadata'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
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
      marginLeft: '-1rem',
    },
    FileTable_Header: {
      '& > span': {
        display: 'flex',
        flexDirection: 'row',
        color: theme.colors.black[500],
      },
    },
    FileTable_Row: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
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
    FileTable_RowWrapper: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
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
    },
    FileRowMenu: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
    },
    FileTable_UploadZone: {
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

const FileName = ({ name }) => {
  return (
    <>
      <FileIcon />
      <Spacer size={'.5rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </>
  )
}

const FolderName = ({ name }) => {
  return (
    <>
      <FolderIcon />
      <Spacer size={'.5rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </>
  )
}

const SortByArrow = () => {
  return (
    <>
      <Spacer size={'.25rem'} />
      <ArrowDownIcon />
    </>
  )
}

const FileTableHeader = ({ sortedBy }) => {
  const c = useStyles({})
  return (
    <div className={classnames(c.FileTable_Row, c.FileTable_Header)}>
      <div
        className={classnames(c.FileTable_Cell, c.FileTable_FileName, c.FileTable_Header)}
      >
        <MetadataSecondary>
          Filename{sortedBy === 'filename' && <SortByArrow />}
        </MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}>
        <MetadataSecondary>
          Created{sortedBy === 'created' && <SortByArrow />}
        </MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}>
        <MetadataSecondary>
          File Type{sortedBy === 'filetype' && <SortByArrow />}
        </MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}>
        <MetadataSecondary>
          Size{sortedBy === 'size' && <SortByArrow />}
        </MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
        <MetadataSecondary>Contributors</MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
        <MetadataSecondary>Versioned From</MetadataSecondary>
      </div>
      <div
        className={classnames(c.FileTable_Cell, c.FileTable_Header, c.FileTable_Action)}
      ></div>
    </div>
  )
}

const FolderRow = ({ folder, handleFolderClick = noop }) => {
  const c = useStyles({})
  const [showFolderMenu, setShowFolderMenu] = useState(false)
  const folderMenuRef = useRef(null)

  useExternalClick(folderMenuRef, () => setShowFolderMenu(false))

  const handleClick = useCallback(() => {
    handleFolderClick(folder)
  }, [handleFolderClick, folder])

  const handleFolderMenu = useCallback(
    e => {
      e.stopPropagation()
      setShowFolderMenu(!showFolderMenu)
    },
    [showFolderMenu]
  )

  return (
    <div className={c.FileTable_RowWrapper} onClick={handleClick}>
      <Spacer size={'1rem'} />
      <div className={c.FileTable_Row}>
        <div
          className={classnames(c.FileTable_Cell, c.FileTable_FileName)}
          title={folder.name}
        >
          <FolderName name={folder.name} />
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
          <MetadataSecondary>-</MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
          <MetadataSecondary>-</MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
          <MetadataSecondary>-</MetadataSecondary>
        </div>
        <div className={c.FileTable_Cell}>
          <Contributors users={folder.members} />
        </div>
        <div className={c.FileTable_Cell}>-</div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Action)}>
          <div className={c.MenuButton} onClick={handleFolderMenu} ref={folderMenuRef}>
            <DotStackIcon />
            {showFolderMenu && (
              <div className={c.FileRowMenu}>
                <FileMenu folder={folder} type={'folder'} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Spacer size={'1rem'} />
      <Divider spacing='0' />
    </div>
  )
}

const FileRow = ({ model, handleModelClick = noop }) => {
  const c = useStyles({})
  const [showFileMenu, setShowFileMenu] = useState(false)
  const fileMenuRef = useRef(null)

  useExternalClick(fileMenuRef, () => setShowFileMenu(false))

  const handleClick = useCallback(() => {
    handleModelClick(model)
  }, [handleModelClick, model])

  const handleFileMenu = useCallback(
    e => {
      e.stopPropagation()
      setShowFileMenu(!showFileMenu)
    },
    [showFileMenu]
  )

  return (
    <div className={c.FileTable_RowWrapper} onClick={handleClick}>
      <Spacer size={'1rem'} />
      <div className={c.FileTable_Row} title={model.name}>
        <div className={classnames(c.FileTable_Cell, c.FileTable_FileName)}>
          <FileName name={model.name} />
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
          <MetadataSecondary>
            {format(new Date(model.uploadDate), 'MMM d, Y')}
          </MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
          <MetadataSecondary>{model.fileType}</MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
          <MetadataSecondary>{formatBytes(model.size)}</MetadataSecondary>
        </div>
        <div className={c.FileTable_Cell}>
          <Contributors users={[model.owner]} />
        </div>
        <div className={c.FileTable_Cell}>
          {model.previousVersionModelId ? (
            <Link to={`/model/${model.previousVersionModelId}`}>
              {model.previousVersionModelId}
            </Link>
          ) : (
            '-'
          )}
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Action)}>
          <div className={c.MenuButton} onClick={handleFileMenu} ref={fileMenuRef}>
            <DotStackIcon />
            {showFileMenu && (
              <div className={c.FileRowMenu}>
                <FileMenu model={model} type={'model'} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Spacer size={'1rem'} />
      <Divider spacing='0' />
    </div>
  )
}

const FileTable = ({
  files = [],
  handleChangeFolder = noop,
  handleEditModel = noop,
  sortedBy,
  searchCase,
  hideDropzone = false,
  onDrop = noop,
}) => {
  const c = useStyles({})

  return (
    <div className={c.FileTable}>
      {files.length > 0 || searchCase ? (
        <>
          <FileTableHeader sortedBy={sortedBy} />
          {files.length > 0 ? (
            files.map((file, index) => {
              if (!file) return null
              const { id } = file
              return (
                <React.Fragment key={`TableRow_${index}`}>
                  {file.subfolders ? (
                    <div key={`FolderRow_${index}`}>
                      <ContextMenuTrigger id={`File_Menu_${id}`} holdToDisplay={1000}>
                        <FolderRow folder={file} handleFolderClick={handleChangeFolder} />
                      </ContextMenuTrigger>
                      <FileContextMenu id={id} folder={file} type={'folder'} />
                    </div>
                  ) : (
                    <div key={`FileRow_${index}`}>
                      <ContextMenuTrigger id={`File_Menu_${id}`} holdToDisplay={1000}>
                        <FileRow model={file} handleModelClick={handleEditModel} />
                      </ContextMenuTrigger>
                      <FileContextMenu id={id} model={file} type={'model'} />
                    </div>
                  )}
                </React.Fragment>
              )
            })
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
