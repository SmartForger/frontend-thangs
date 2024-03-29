import React, { useEffect } from 'react'
import { Spinner, CardCollectionRelated, ModelCardRelated } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
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
    RelatedModels_LoadingIcon: {
      flex: 'none',
    },
  }
})

const RelatedModels = ({
  isLoading,
  isHideEmpty = false,
  isPublicResults = false,
  data = {},
  className,
  modelName,
}) => {
  const c = useStyles()

  useEffect(() => {
    track('Related Models Shown', { matches: (data.matches && data.matches.length) || 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isHideEmpty && (!data || !data.matches || !data.matches.length)) return null
  return (
    <div className={classnames(className, c.RelatedModels_Related)}>
      <div className={c.RelatedModels_Header}>
        <UploadIcon
          className={c.RelatedModels_LoadingIcon}
          width={'1rem'}
          height={'1rem'}
        />
        <h2>
          Geometrically Related {isPublicResults ? 'found elsewhere' : `to ${modelName}`}
        </h2>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
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
      )}
    </div>
  )
}

export default RelatedModels
