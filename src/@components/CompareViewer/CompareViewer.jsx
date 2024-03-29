import React from 'react'
import { ContainerRow, Spinner } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { CompareModels } from '@physna/compare-ui'

const useStyles = createUseStyles(_theme => {
  return {
    FileView_CompareWrapper: {
      height: '40.5rem',
    },
  }
})

const Compare = ({ model1, model2, token, isLoading }) => {
  const c = useStyles({})

  return (
    <ContainerRow className={c.FileView_CompareWrapper}>
      {isLoading && <Spinner />}
      {!isLoading && (
        <CompareModels
          token={token.token}
          tokenScope={'buckets'}
          tokenExpiresAt={token.token_expires_at}
          modelAId={model1}
          modelBId={model2}
          modelABucket={process.env.REACT_APP_COMPARE_BUCKET}
          modelBBucket={process.env.REACT_APP_COMPARE_BUCKET}
          comparisonServiceEndpoint={process.env.REACT_APP_COMPARE_URL}
          comparisonsToDisplay={{
            model_a: true,
            model_b: false,
            difference_a: true,
            difference_b: true,
            intersection_a: false,
            intersection_b: false,
          }}
          variant={{
            type: 'sideBySide',
            syncCameras: true,
          }}
        />
      )}
    </ContainerRow>
  )
}

export default Compare
