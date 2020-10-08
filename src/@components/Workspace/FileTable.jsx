import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Contributors, Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { MetadataSecondary } from '@components/Text/Metadata'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { formatBytes } from '@utilities'

const useStyles = createUseStyles(_theme => {
  return {
    FileTable: {},
    FileTable_Header: {},
    FileTable_Row: {
      display: 'flex',
      flexDirection: 'row',
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
    FileTable_FileName: {
      width: '40%',
      maxWidth: '14rem',

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
  }
})

const noop = () => null

const Filename = ({ name }) => {
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

const FileTableHeader = () => {
  const c = useStyles({})
  return (
    <div className={classnames(c.FileTable_Row, c.FileTable_Header)}>
      <div
        className={classnames(c.FileTable_Cell, c.FileTable_FileName, c.FileTable_Header)}
      >
        <MetadataSecondary>Filename</MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}>
        <MetadataSecondary>Changed</MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}>
        <MetadataSecondary>File Type</MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}>
        <MetadataSecondary>Size</MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
        <MetadataSecondary>Contributors</MetadataSecondary>
      </div>
      <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
        <MetadataSecondary>Versioned From</MetadataSecondary>
      </div>
    </div>
  )
}

const FolderRow = ({ folder, handleFolderClick = noop }) => {
  const c = useStyles({})
  const handleClick = useCallback(() => {
    handleFolderClick(folder)
  }, [handleFolderClick, folder])

  return (
    <div onClick={handleClick}>
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
      </div>
      <Spacer size={'1rem'} />
      <Divider spacing='0' />
    </div>
  )
}

const FileRow = ({ model, handleModelClick = noop }) => {
  const c = useStyles({})
  const handleClick = useCallback(() => {
    handleModelClick(model)
  }, [handleModelClick, model])

  return (
    <div onClick={handleClick}>
      <Spacer size={'1rem'} />
      <div className={c.FileTable_Row} title={model.name}>
        <div className={classnames(c.FileTable_Cell, c.FileTable_FileName)}>
          <Filename name={model.name} />
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
      </div>
      <Spacer size={'1rem'} />
      <Divider spacing='0' />
    </div>
  )
}

const FileTable = ({ files = [], handleChangeFolder = noop, handleEditModel = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.FileTable}>
      <FileTableHeader />
      {files.map((file, index) => {
        return (
          <React.Fragment key={`FileRow_${index}`}>
            {file.subfolders ? (
              <FolderRow folder={file} handleFolderClick={handleChangeFolder} />
            ) : (
              <FileRow model={file} handleModelClick={handleEditModel} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default FileTable