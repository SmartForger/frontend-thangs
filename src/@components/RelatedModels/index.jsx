import React from 'react'

import { NoResults } from '@components/NoResults'
import CardCollection from '@components/CardCollection'
import { Spinner } from '@components/Spinner'
import { ProgressText } from '@components/ProgressText'
import { ReactComponent as LoadingIcon } from '@svg/image-loading-icon.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { isError, isProcessing } from '@utilities'
import useFetchOnce from '@services/store-service/hooks/useFetchOnce'
import { logger } from '../../logging'

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
    },
  }
})

export function RelatedModels({ modelId, className }) {
  const c = useStyles()
  const {
    atom: { data: model, isLoading: loading, isError: error },
  } = useFetchOnce(modelId, 'model')

  if (loading) {
    return <Spinner />
  } else if (error) {
    logger.error('error', error)
    return <Spinner />
  }

  return (
    <div className={classnames(className, c.RelatedModels_Related)}>
      <div className={c.RelatedModels_Header}>Geometrically Similar</div>

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
          models={model && model.relatedModels}
          maxPerRow={3}
          noResultsText='There were no geometrically similar matches found.'
        />
      )}
    </div>
  )
}
