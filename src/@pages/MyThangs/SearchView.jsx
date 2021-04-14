import React, { useEffect } from 'react'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { FileTable, Spacer, Spinner } from '@components'
import * as types from '@constants/storeEventTypes'
import { pageview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    SearchView: {
      display: 'flex',
      flexDirection: 'row',
    },
    SearchView_Content: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1.5rem',
      [md]: {
        marginLeft: '2rem',
        minWidth: '56rem',
      },
    },
    SearchView_Folders: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
    SearchView_Row: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    SearchView_Col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    SearchView_Spinner: {
      marginTop: '10rem',
    },
    SearchView_CurrentFolder: {
      color: theme.colors.black[500],
    },
    SearchView_RootLink: {
      cursor: 'pointer',
    },
  }
})

const noop = () => null

const SearchView = ({ className, handleChangeFolder = noop, handleEditModel = noop }) => {
  const c = useStyles({})
  const { searchTerm } = useParams()
  const { dispatch, searchThangs } = useStoreon('searchThangs')
  const { data: files = {}, isLoading } = searchThangs

  useEffect(() => {
    pageview('MyThangs - SearchMyThangs')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(types.SEARCH_MY_THANGS, {
      searchTerm,
    })
  }, [dispatch, searchTerm])

  const results = files && files.models && files.models.length ? files.models : []

  return (
    <main className={classnames(className, c.SearchView)}>
      <div className={c.SearchView_Content}>
        <Spacer size='2rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Search Results: {searchTerm}</Title>
        <Spacer size='2rem' />
        {isLoading ? (
          <Spinner />
        ) : (
          <FileTable
            files={results}
            handleEditModel={handleEditModel}
            handleChangeFolder={handleChangeFolder}
            sortedBy={'filename'}
            searchCase={true}
          ></FileTable>
        )}
      </div>
    </main>
  )
}

export default SearchView
