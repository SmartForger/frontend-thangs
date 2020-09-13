import React from 'react'
import { CardCollection, Spinner } from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import { logger } from '@utilities/logging'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import useFetchPerMount from '@hooks/useServices/useFetchPerMount'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'

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
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',

      '& > svg': {
        marginRight: '.5rem',
      },
    },
    RelatedModels_Related: {
      gridArea: 'related',
      marginBottom: '2rem',
    },
  }
})

const RelatedModels = ({ modelId, className }) => {
  const c = useStyles()

  const {
    atom: { isLoading, isError, data },
  } = useFetchPerMount(modelId, 'related-models')

  if (isLoading) {
    return <Spinner />
  } else if (isError) {
    logger.error('error', isError)
    return <Spinner />
  }

  return (
    <div className={classnames(className, c.RelatedModels_Related)}>
      <div className={c.RelatedModels_Header}>
        <UploadIcon width={'1rem'} height={'1rem'} />
        Geometrically Related
      </div>

      <CardCollection maxPerRow={3} noResultsText='No geometrically related matches yet.'>
        {data && data.matches && data.matches.length > 0 ? (
          <ModelCards items={data.matches} />
        ) : null}
      </CardCollection>
    </div>
  )
}

export default RelatedModels
