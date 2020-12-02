import React from 'react'
import { Spinner, CardCollectionRelated, ModelCardRelated } from '@components'

import { logger } from '@utilities/logging'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    RelatedModels: {},
    RelatedModels_NoResults: {
      display: 'flex',
      alignItems: 'center',
      '& > svg': {
        marginRight: '.5rem',
      },
    },
    RelatedModels_Icon: {
      width: '1.5rem',
      height: '1.5rem',
    },
    RelatedModels_Header: {
      ...theme.text.formCalloutText,
      fontSize: '1.125rem',
      lineHeight: '.75rem',
      marginBottom: '1.5rem',
    },
    RelatedModels_Related: {
      gridArea: 'related',
      marginBottom: '2rem',
    },
  }
})

const RelatedModels = ({ isLoading, isError, data = {}, className }) => {
  const c = useStyles()

  if (isLoading) {
    return <Spinner />
  } else if (isError) {
    logger.error('error', isError)
    return <Spinner />
  }
  track('Related Models Shown', { matches: (data.matches && data.matches.length) || 0 })

  return (
    <div className={classnames(className, c.RelatedModels_Related)}>
      <h4 className={c.RelatedModels_Header}>Geometrically Similar</h4>

      <CardCollectionRelated
        maxPerRow={3}
        noResultsText='No geometrically related matches yet.'
      >
        {data.matches && data.matches.length > 0
          ? Array.isArray(data.matches) &&
            data.matches.map((model, index) => (
              <ModelCardRelated
                key={`model-${model.id}:${index}`}
                model={model}
                geoRelated={true}
              />
            ))
          : null}
      </CardCollectionRelated>
    </div>
  )
}

export default RelatedModels
