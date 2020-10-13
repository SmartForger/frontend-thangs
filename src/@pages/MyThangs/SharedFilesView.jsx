import React, { useMemo } from 'react'
import * as R from 'ramda'
import {
  AddContextMenu,
  FileTable,
  FileCard,
  FolderCard,
  Spacer,
  TitleTertiary,
} from '@components'
import { useStarred } from '@hooks'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'

const useStyles = createUseStyles(theme => {
  return {
    SharedFilesView: {
      display: 'flex',
      flexDirection: 'row',
    },
    SharedFilesView_Content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '56rem',
    },
    SharedFilesView_Folders: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
    SharedFilesView_Row: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    SharedFilesView_StarredRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    SharedFilesView_Col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    SharedFilesView_Spinner: {
      marginTop: '10rem',
    },
    SharedFilesView_CurrentFolder: {
      color: theme.colors.black[500],
    },
    SharedFilesView_RootLink: {
      cursor: 'pointer',
    },
    SharedFilesView_Starred: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
  }
})

const noop = () => null

const SharedFilesView = ({
  className,
  handleChangeFolder = noop,
  handleEditModel = noop,
  sharedFolders,
}) => {
  const c = useStyles({})
  const { starredSharedModels = [], starredSharedFolders = [] } = useStarred()
  const sortedFolders = useMemo(() => {
    return !R.isEmpty(sharedFolders)
      ? sharedFolders
          .sort((a, b) => {
            if (a.name < b.name) return -1
            else if (a.name > b.name) return 1
            return 0
          })
          .filter(folder => !folder.name.includes('//'))
      : []
  }, [sharedFolders])

  return (
    <>
      <ContextMenuTrigger id='Add_Menu' holdToDisplay={1000}>
        <main className={classnames(className, c.SharedFilesView)}>
          <Spacer size='2rem' />
          <div className={c.SharedFilesView_Content}>
            <Spacer size='2rem' />
            <TitleTertiary>Shared Files</TitleTertiary>
            <Spacer size='4rem' />
            <TitleTertiary>Starred</TitleTertiary>
            <div className={c.SharedFilesView_Starred}>
              {starredSharedFolders.map((folder, index) => {
                return (
                  <div className={c.SharedFilesView_StarredRow} key={`starred_${index}`}>
                    <FolderCard folder={folder} handleClick={handleChangeFolder} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
            </div>
            <Spacer size='4rem' />
            <TitleTertiary>Files</TitleTertiary>
            <Spacer size='2rem' />
            <FileTable
              files={sortedFolders}
              handleEditModel={handleEditModel}
              handleChangeFolder={handleChangeFolder}
            ></FileTable>
          </div>
          <Spacer size='2rem' />
        </main>
      </ContextMenuTrigger>
      <AddContextMenu />
    </>
  )
}

export default SharedFilesView
