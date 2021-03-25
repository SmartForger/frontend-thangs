import React, { useCallback, useEffect } from 'react'
import { Layout } from '@components'
import TextSearch from './TextSearch'
import GeoSearch from './GeoSearch'
import { useQuery } from '@hooks'
import { pageview } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { createUseStyles } from '@style'

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
  const { setOverlay, setOverlayOpen } = useOverlay()

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

  const handleReportModel = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'reportModel',
        data: {
          model: model,
          afterSend: () => {
            setOverlayOpen(false)
          },
        },
      })
    },
    [setOverlay, setOverlayOpen]
  )

  const handleFindRelated = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'searchByUpload',
        data: {
          model,
        },
      })
    },
    [setOverlay]
  )

  return (
    <div className={c.SearchResults_Page}>
      <div className={c.SearchResults_MainContent}>
        {!modelId && !phynId ? (
          <TextSearch
            onFindRelated={handleFindRelated}
            onReportModel={handleReportModel}
          />
        ) : (
          <GeoSearch
            onFindRelated={handleFindRelated}
            onReportModel={handleReportModel}
          />
        )}
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
