import React, { useCallback } from 'react'
import * as R from 'ramda'
import {
  Button,
  FileTable,
  FolderCard,
  MetadataPrimary,
  Spacer,
  Spinner,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as InviteIcon } from '@svg/icon-invite.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-filled.svg'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    AllFilesView: {
      display: 'flex',
      flexDirection: 'row',
    },
    AllFilesView_Content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '56rem',
    },
    AllFilesView_Folders: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
    AllFilesView_Row: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    AllFilesView_Col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    AllFilesView_Spinner: {
      marginTop: '10rem',
    },
    AllFilesView_CurrentFolder: {
      color: theme.colors.black[500],
    },
    AllFilesView_RootLink: {
      cursor: 'pointer',
    },
  }
})

const noop = () => null

const AllFilesView = ({
  className,
  setCurrentView = noop,
  handleEditModel = noop,
  folders,
  models,
}) => {
  const c = useStyles({})

  const handleChangeFolder = useCallback(
    folderId => {
      setCurrentView('folderView', { id: folderId })
    },
    [setCurrentView]
  )

  return (
    <main className={classnames(className, c.AllFilesView)}>
      <Spacer size='2rem' />
      <div className={c.AllFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>All Files</TitleTertiary>
        <Spacer size='4rem' />
        <TitleTertiary>Folders</TitleTertiary>
        <div className={c.AllFilesView_Folders}>
          {folders.map((folder, index) => (
            <React.Fragment key={`folder=${folder.id}_${index}`}>
              <FolderCard folder={folder} onClick={() => handleChangeFolder(folder.id)} />
              <Spacer size={'2rem'} />
            </React.Fragment>
          ))}
        </div>
        <Spacer size='4rem' />
        <TitleTertiary>Files</TitleTertiary>
        <Spacer size='2rem' />
        <FileTable models={models} handleEditModel={handleEditModel}></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default AllFilesView
