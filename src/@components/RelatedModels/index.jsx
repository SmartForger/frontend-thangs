import React from 'react'
import { NoResults, CardCollection, Spinner, ProgressText } from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import { ReactComponent as LoadingIcon } from '@svg/image-loading-icon.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { isError, isProcessing } from '@utilities'
import { logger } from '@utilities/logging'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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
      ...theme.mixins.text.headerText,
      marginBottom: '1.5rem',
    },
    RelatedModels_Related: {
      gridArea: 'related',
      marginBottom: '2rem',
    },
  }
})

const RelatedModels = ({ modelId, className }) => {
  const c = useStyles()
  let loading = false //TEMP
  let error = false //TEMP
  let model = []
  console.log('This needs changed to REST!', 'GET models/related/', modelId)

  if (loading) {
    return <Spinner />
  } else if (error) {
    logger.error('error', error)
    return <Spinner />
  }

  return (
    <div className={classnames(className, c.RelatedModels_Related)}>
      <div className={c.RelatedModels_Header}>Geometrically Related</div>

      {isProcessing(model) ? (
        <NoResults className={c.RelatedModels_NoResults}>
          <LoadingIcon className={c.RelatedModels_Icon} />
          <ProgressText text='Processing for matches' />
        </NoResults>
      ) : isError(model) ? (
        <NoResults className={c.RelatedModels_NoResults}>
          <ErrorIcon className={c.RelatedModels_Icon} />
          An error occurred while processing for matches.
        </NoResults>
      ) : (
        <CardCollection
          maxPerRow={3}
          noResultsText='There were no geometrically related matches found.'
        >
          {model && model.relatedModels && model.relatedModels.length > 0 ? (
            <ModelCards items={model && model.relatedModels} />
          ) : null}
        </CardCollection>
      )}
    </div>
  )
}

export default RelatedModels
