import React, { useMemo } from 'react'
import * as R from 'ramda'
import { AddContextMenu, FileTable, FolderCard, Spacer, TitleTertiary } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'

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
  handleChangeFolder = noop,
  handleEditModel = noop,
  myFolders: folders,
  models,
}) => {
  const c = useStyles({})

  const sortedFolders = useMemo(() => {
    return !R.isEmpty(folders)
      ? folders
        .sort((a, b) => {
          if (a.name < b.name) return -1
          else if (a.name > b.name) return 1
          return 0
        })
        .filter(folder => !folder.name.includes('//'))
      : []
  }, [folders])

  const sortedModels = useMemo(() => {
    return !R.isEmpty(models)
      ? models.sort((a, b) => {
        if (a.name < b.name) return -1
        else if (a.name > b.name) return 1
        return 0
      })
      : []
  }, [models])

  return (
    <>
      <ContextMenuTrigger id='Add_Menu' holdToDisplay={1000}>
        <main className={classnames(className, c.AllFilesView)}>
          <Spacer size='2rem' />
          <div className={c.AllFilesView_Content}>
            <Spacer size='2rem' />
            <TitleTertiary>All Files</TitleTertiary>
            <Spacer size='4rem' />
            <TitleTertiary>Folders</TitleTertiary>
            <div className={c.AllFilesView_Folders}>
              {sortedFolders.map((folder, index) => (
                <React.Fragment key={`folder=${folder.id}_${index}`}>
                  <FolderCard folder={folder} handleClick={handleChangeFolder} />
                  <Spacer size={'2rem'} />
                </React.Fragment>
              ))}
            </div>
            <Spacer size='4rem' />
            <TitleTertiary>Files</TitleTertiary>
            <Spacer size='2rem' />
            <FileTable
              files={sortedModels}
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

export default AllFilesView
