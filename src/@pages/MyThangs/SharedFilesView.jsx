import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { FileTable, FolderCard, Spacer, Spinner } from '@components'
import { useStarred } from '@hooks'
import { pageview } from '@utilities/analytics'
import { getSharedFolders } from '@selectors'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    SharedFilesView: {
      display: 'flex',
      flexDirection: 'row',
    },
    SharedFilesView_Content: {
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
      position: 'relative',
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
    SharedFilesView_Loader: {
      marginRight: '1.5rem',
      [md]: {
        marginRight: '2rem',
      },
    },
  }
})

const noop = () => null

const SharedFilesView = ({
  className,
  handleChangeFolder = noop,
  handleEditModel = noop,
  folders,
}) => {
  const c = useStyles({})
  const { starredSharedFolders = [], isLoading: isLoadingStarred } = useStarred()

  const filteredFolders = useMemo(() => {
    return getSharedFolders(folders).filter(folder => !folder.parentId)
  }, [folders])

  useEffect(() => {
    pageview('MyThangs - SharedView')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={classnames(className, c.SharedFilesView)}>
      <div className={c.SharedFilesView_Content}>
        <Spacer size='2rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Shared Files</Title>

        {isLoadingStarred && (
          <div className={c.SharedFilesView_Loader}>
            <Spacer size='4rem' />
            <Spinner />
          </div>
        )}

        {starredSharedFolders.length > 0 && (
          <>
            <Spacer size='4rem' />
            <Title headerLevel={HeaderLevel.tertiary}>Starred</Title>
            <div className={c.SharedFilesView_Starred}>
              {starredSharedFolders.map((folder, index) => {
                return (
                  <div className={c.SharedFilesView_StarredRow} key={`starred_${index}`}>
                    <FolderCard
                      folder={folder}
                      handleClick={handleChangeFolder}
                      isSharedFolder={true}
                    />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
            </div>
          </>
        )}
        <Spacer size='4rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Files</Title>
        <Spacer size='2rem' />
        <FileTable
          files={filteredFolders}
          sortedBy='filename'
          handleEditModel={handleEditModel}
          handleChangeFolder={handleChangeFolder}
          searchCase={true}
        ></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default SharedFilesView
