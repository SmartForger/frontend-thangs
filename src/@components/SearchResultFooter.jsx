import React, { useMemo } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ContainerRow, DownloadARLink, Spacer } from '@components'
import { shouldShowViewRelated, canDownloadAR } from '@utilities'

const useStyles = createUseStyles(theme => {
  return {
    SearchResultFooter_Link: {
      fontSize: '.75rem',
      fontWeight: '500',
      lineHeight: '1rem',
      cursor: 'pointer',
      textDecoration: 'underline',
      color: theme.colors.blue[500],
    },
  }
})

const noop = () => null

const SearchResultFooter = ({ model, onFindRelated }) => {
  const c = useStyles()
  const isARSupported = useMemo(() => canDownloadAR(model), [model])

  return (
    <ContainerRow wrap='wrap'>
      {shouldShowViewRelated(model) && (
        <>
          <div
            className={c.SearchResultFooter_Link}
            onClick={() => onFindRelated({ model, matches: model?.nMatchedModels })}
          >
            View Related Models
          </div>
          <Spacer size={'1rem'} />
        </>
      )}
      {isARSupported && (
        <DownloadARLink
          model={model}
          isAuthedUser={true}
          openSignupOverlay={noop}
          downloadTrackingEvent='Download AR from Search'
          TargetComponent={({ onClick = noop, isLoading }) => (
            <ContainerRow>
              <div onClick={onClick} className={c.SearchResultFooter_Link}>
                {isLoading
                  ? 'Downloading Augmented Reality'
                  : 'Download Augmented Reality'}
              </div>
              {!isLoading && <Spacer width={'1.5rem'} />}
            </ContainerRow>
          )}
        />
      )}
    </ContainerRow>
  )
}

export default SearchResultFooter
