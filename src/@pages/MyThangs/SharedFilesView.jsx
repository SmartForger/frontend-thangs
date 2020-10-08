import React, { useMemo } from 'react'
import * as R from 'ramda'
import { FileTable, FolderCard, Spacer, TitleTertiary } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'

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

  const starredSharedFolders = useMemo(() => {
    return []
  }, [])

  return (
    <main className={classnames(className, c.SharedFilesView)}>
      <Spacer size='2rem' />
      <div className={c.SharedFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Shared Files</TitleTertiary>
        <Spacer size='4rem' />
        <TitleTertiary>Starred</TitleTertiary>
        <div className={c.SharedFilesView_Folders}>
          {starredSharedFolders.map((folder, index) => (
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
          files={sortedFolders}
          handleEditModel={handleEditModel}
          handleChangeFolder={handleChangeFolder}
        ></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default SharedFilesView
