import React, { useEffect } from 'react'
import { Layout } from '@components'
import { useQuery } from '@hooks'
import { pageview } from '@utilities/analytics'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { SearchActionProvider } from './SearchActions'
import TextSearch from './TextSearch'
import GeoSearch from './GeoSearch'

const useStyles = createUseStyles(_theme => {
  return {
    SearchResults_Page: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    SearchResults_MainContent: {
      width: '100%',
    },
  }
})

const Page = () => {
  const c = useStyles()
  const modelId = useQuery('modelId')
  const phynId = useQuery('phynId')
  const related = useQuery('related')

  useEffect(() => {
    if (related) {
      pageview('SearchResults Related')
    } else if (modelId) {
      pageview('SearchResults Model')
    } else {
      pageview('SearchResults Text')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.SearchResults_Page}>
      <div className={c.SearchResults_MainContent}>
        <SearchActionProvider>
          {!modelId && !phynId ? <TextSearch /> : <GeoSearch />}
        </SearchActionProvider>
      </div>
    </div>
  )
}

const SearchResults = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default SearchResults
