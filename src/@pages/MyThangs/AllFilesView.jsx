import React, { useEffect, useMemo } from 'react'
import * as R from 'ramda'
import { FolderCard, Spacer, TitleTertiary } from '@components'
import FileTable from '@components/Workspace/FileTableNew'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { pageview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    AllFilesView: {
      display: 'flex',
      flexDirection: 'row',
      overflowY: 'scroll',
    },
    AllFilesView_Content: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1.5rem',
      [md]: {
        marginLeft: '2rem',
        minWidth: '56rem',
      },
    },
    AllFilesView_Folders: {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',

      [md]: {
        flexWrap: 'wrap',
        overflowX: 'hidden',
      },

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
    AllFilesView_FolderCard: {
      display: 'flex',
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
  onDrop = noop,
}) => {
  const c = useStyles({})

  useEffect(() => {
    pageview('MyThangs - AllFiles')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedFolders = useMemo(() => {
    return folders !== undefined && R.isEmpty(folders)
      ? folders
          .sort((a, b) => {
            if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
            else if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
            return 0
          })
          .filter(folder => !folder.name.includes('//'))
      : []
  }, [folders])

  return (
    <main className={classnames(className, c.AllFilesView)}>
      <div className={c.AllFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>All Files</TitleTertiary>
        {sortedFolders.length > 0 && (
          <>
            <Spacer size='4rem' />
            <TitleTertiary>Folders</TitleTertiary>
            <div className={c.AllFilesView_Folders}>
              {sortedFolders.map((folder, index) => (
                <div
                  className={c.AllFilesView_FolderCard}
                  key={`folder=${folder.id}_${index}`}
                >
                  <FolderCard folder={folder} handleClick={handleChangeFolder} />
                  <Spacer size={'2rem'} />
                </div>
              ))}
            </div>
          </>
        )}
        {models.length > 0 && (
          <>
            <Spacer size='4rem' />
            <TitleTertiary>My Public Files</TitleTertiary>
            <Spacer size='2rem' />
          </>
        )}
        <FileTable
          files={models || []}
          handleEditModel={handleEditModel}
          handleChangeFolder={handleChangeFolder}
          sortedBy={'created'}
          hideDropzone={sortedFolders.length > 0}
          onDrop={onDrop}
          height={32}
        />
      </div>
    </main>
  )
}

export default AllFilesView
