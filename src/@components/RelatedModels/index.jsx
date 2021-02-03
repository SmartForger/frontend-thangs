import React from 'react'
import { Spinner, CardCollectionRelated, ModelCardRelated } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
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
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',

      '& > svg': {
        marginRight: '.5rem',
      },

      '& > h2': {
        ...theme.text.formCalloutText,
      },
    },
    RelatedModels_Related: {
      gridArea: 'related',
      marginBottom: '2rem',
    },
  }
})

const RelatedModels = ({
  isLoading,
  isPublicResults = false,
  data = [],
  className,
  modelName,
}) => {
  const c = useStyles()

  track('Related Models Shown', { matches: (data.matches && data.matches.length) || 0 })

  return (
    <div className={classnames(className, c.RelatedModels_Related)}>
      <div className={c.RelatedModels_Header}>
        <UploadIcon width={'1rem'} height={'1rem'} />
        <h2>
          Geometrically Related {isPublicResults ? 'found elsewhere' : `to ${modelName}`}
        </h2>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        data.map((collection, index) => {
          return (
            <CardCollectionRelated
              key={`collection-${index}`}
              maxPerRow={3}
              noResultsText='No geometrically related matches yet.'
            >
              {collection.matches && collection.matches.length > 0
                ? Array.isArray(collection.matches) &&
                  collection.matches.map((model, index) => (
                    <ModelCardRelated
                      key={`model-${model.id}:${index}`}
                      model={model}
                      geoRelated={true}
                    />
                  ))
                : null}
            </CardCollectionRelated>
          )
        })
      )}
    </div>
  )
}

export default RelatedModels
