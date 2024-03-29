import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { FileTable, FolderCard, Spacer } from '@components'
import { pageview } from '@utilities/analytics'
import { getRootFolders } from '@selectors'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    AllFilesView: {
      display: 'flex',
      flexDirection: 'row',
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
  folders,
  models,
  onDrop = noop,
}) => {
  const c = useStyles({})

  useEffect(() => {
    pageview('MyThangs - AllFiles')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedFolders = useMemo(() => {
    return getRootFolders(folders)
      .filter(folder => !folder.shared)
      .sort((a, b) => {
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
        else if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
        return 0
      })
  }, [folders])

  return (
    <main className={classnames(className, c.AllFilesView)}>
      <div className={c.AllFilesView_Content}>
        <Spacer size='2rem' />
        <Title headerLevel={HeaderLevel.tertiary}>All Files</Title>
        {sortedFolders.length > 0 && (
          <>
            <Spacer size='4rem' />
            <Title headerLevel={HeaderLevel.tertiary}>My Folders</Title>
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
            <Spacer size='4rem' />
          </>
        )}
        <FileTable
          files={models || []}
          handleChangeFolder={handleChangeFolder}
          handleEditModel={handleEditModel}
          heightOffset={0}
          hideDropzone={sortedFolders.length > 0}
          onDrop={onDrop}
          sortedBy={'created'}
          title='My Models'
          hasSubtree={false}
        ></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default AllFilesView
