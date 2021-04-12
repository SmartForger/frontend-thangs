import React from 'react'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import {
  Card,
  MetadataSecondary,
  ModelThumbnail,
  SearchAnchor,
  Spacer,
} from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    PartThumbnailList_ThumbnailsRow: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    PartThumbnailList_Metadata: {
      color: theme.colors.grey[700],
    },
    PartThumbnailList_PartThumbnailWrapper: {
      position: 'relative',
      marginRight: '.5rem',

      width: '48px',
      height: '48px !important',

      '&:after': {
        content: '',
        display: 'block',
        paddingBottom: '100%',
      },
    },
    PartThumbnailList_Thumbnail: {
      width: '100%',
      height: '100%',
      padding: '0 !important',
      margin: 'auto',
      borderRadius: '.5rem',

      [md]: {
        maxWidth: '100%',
      },
    },
    PartThumbnailList_OverlayContent: {
      display: 'flex',
      alignItems: 'center',

      '& svg': {
        width: '0.5rem',
      },
    },
  }
})

const MorePartsIndicator = ({ remainingPartCount }) => {
  const c = useStyles()
  return (
    <span className={c.PartThumbnailList_OverlayContent}>
      <PlusIcon />
      {remainingPartCount < 100 && remainingPartCount}
    </span>
  )
}

export const PartThumbnailList = ({
  isExternalModel,
  onThangsClick,
  parts,
  scope,
  maximumPartsToDisplay = 12,
  searchIndex,
}) => {
  const c = useStyles()
  return (
    <div>
      <MetadataSecondary className={c.PartThumbnailList_Metadata}>
        Other parts in this model ({parts.length})
      </MetadataSecondary>
      <Spacer size={'0.75rem'} />
      <div className={c.PartThumbnailList_ThumbnailsRow}>
        {parts.slice(0, maximumPartsToDisplay).map((part, i) => (
          <SearchAnchor
            key={part.modelId}
            to={{
              pathname: part.attributionUrl,
              search: `?part=${part.modelId}`,
              state: { prevPath: window.location.href },
            }}
            onThangsClick={onThangsClick}
            isExternal={isExternalModel}
            scope={scope}
            searchIndex={searchIndex}
          >
            <Card className={classnames(c.PartThumbnailList_PartThumbnailWrapper)}>
              <ModelThumbnail
                className={c.PartThumbnailList_Thumbnail}
                name={part.modelFileName}
                model={part}
                showOverlay={
                  maximumPartsToDisplay === i + 1 && parts.length > maximumPartsToDisplay
                }
                overlayContent={
                  <MorePartsIndicator
                    // Bump count by one since we should include the part that we are overlapping
                    remainingPartCount={parts.length - maximumPartsToDisplay + 1}
                  />
                }
                mini
              />
            </Card>
          </SearchAnchor>
        ))}
      </div>
    </div>
  )
}

export default PartThumbnailList
