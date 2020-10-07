import React from 'react'
import { Link } from 'react-router-dom'
import { Spacer, Divider, SingleLineBodyText } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { MetadataSecondary } from '@components/Text/Metadata'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'

const useStyles = createUseStyles(_theme => {
  return {
    FileTable: {},
    FileTable_Header: {},
    FileTable_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    FileTable_Cell: {
      width: '25%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    FileTable_FileName: {
      width: '40%',
    },
    FileTable_Size: {
      width: '12%',
    },
  }
})

const Filename = ({ name }) => {
  return (
    <>
      <FileIcon />
      <Spacer size={'.5rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </>
  )
}

const Foldername = ({ name }) => {
  return (
    <>
      <FolderIcon />
      <Spacer size={'.5rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </>
  )
}

const FileTable = ({ _files = [] }) => {
  const c = useStyles({})

  return (
    <div className={c.FileTable}>
      <div className={classnames(c.FileTable_Row, c.FileTable_Header)}>
        <div
          className={classnames(
            c.FileTable_Cell,
            c.FileTable_FileName,
            c.FileTable_Header
          )}
        >
          <MetadataSecondary>Filename</MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
          <MetadataSecondary>Changed</MetadataSecondary>
        </div>
        <div
          className={classnames(c.FileTable_Cell, c.FileTable_Size, c.FileTable_Header)}
        >
          <MetadataSecondary>Size</MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
          <MetadataSecondary>Contributors</MetadataSecondary>
        </div>
        <div className={classnames(c.FileTable_Cell, c.FileTable_Header)}>
          <MetadataSecondary>Forked From</MetadataSecondary>
        </div>
      </div>
      <div>
        <Spacer size={'1rem'} />
        <div className={c.FileTable_Row}>
          <div className={classnames(c.FileTable_Cell, c.FileTable_FileName)}>
            <Foldername name={'Starship Enterprise'} />
          </div>
          <div className={c.FileTable_Cell}>
            <MetadataSecondary>Jun 1, 2020 • Brandon</MetadataSecondary>
          </div>
          <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
            <MetadataSecondary>37mb</MetadataSecondary>
          </div>
          <div className={c.FileTable_Cell}>AVATARS</div>
          <div className={c.FileTable_Cell}>
            <Link>parent.stl</Link>
          </div>
        </div>
        <Spacer size={'1rem'} />
        <Divider spacing='0' />
      </div>
      <div>
        <Spacer size={'1rem'} />
        <div className={c.FileTable_Row}>
          <div className={classnames(c.FileTable_Cell, c.FileTable_FileName)}>
            <Filename name={'Pikachu.stl'} />
          </div>
          <div className={c.FileTable_Cell}>
            <MetadataSecondary>Jun 1, 2020 • Damjan</MetadataSecondary>
          </div>
          <div className={classnames(c.FileTable_Cell, c.FileTable_Size)}>
            <MetadataSecondary>37mb</MetadataSecondary>
          </div>
          <div className={c.FileTable_Cell}>AVATARS</div>
          <div className={c.FileTable_Cell}>
            <Link>parent.stl</Link>
          </div>
        </div>
        <Spacer size={'1rem'} />
        <Divider spacing='0' />
      </div>
    </div>
  )
}

export default FileTable
