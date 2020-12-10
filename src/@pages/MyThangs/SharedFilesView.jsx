import React, { useEffect, useMemo } from 'react'
import * as R from 'ramda'
import { FileTable, FolderCard, Spacer, Spinner, TitleTertiary } from '@components'
import { useStarred } from '@hooks'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { pageview } from '@utilities/analytics'

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
      [md]: {
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
      flexWrap: 'wrap',
      position: 'relative',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
    SharedFilesView_Loader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.19)',
      zIndex: 1,
      top: '-.75rem',
      left: '-1rem',
      display: 'flex',
      alignItems: 'center',
    },
    SharedFilesView_Spacer: {
      display: 'none',
      [md]: {
        display: 'block',
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
  const { starredSharedFolders = [], isLoading: isLoadingStarred } = useStarred()
  const hasStarred = useMemo(() => starredSharedFolders.length > 0, [
    starredSharedFolders.length,
  ])

  const filteredFolders = useMemo(() => {
    return !R.isEmpty(sharedFolders)
      ? sharedFolders.filter(folder => !folder.name.includes('//'))
      : []
  }, [sharedFolders])

  useEffect(() => {
    pageview('MyThangs - SharedView')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={classnames(className, c.SharedFilesView)}>
      <Spacer size='2rem' />
      <div className={c.SharedFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Shared Files</TitleTertiary>
        <Spacer size='4rem' className={c.SharedFilesView_Spacer} />
        {(isLoadingStarred || hasStarred) && (
          <>
            <TitleTertiary>Starred</TitleTertiary>
            <div className={c.SharedFilesView_Starred}>
              {isLoadingStarred && (
                <div className={c.SharedFilesView_Loader}>
                  <Spinner />
                </div>
              )}
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
        <TitleTertiary>Files</TitleTertiary>
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
