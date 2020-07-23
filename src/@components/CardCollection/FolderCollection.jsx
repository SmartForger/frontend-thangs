import React from 'react'
import { NoResults } from '../NoResults'
import FolderCard from '../FolderCard'
import { ShowMoreButton } from '../ShowMore'
import { Grid } from './Grid'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    FolderCollection: {},
    FolderCollection_ShowMoreContainer: {
      marginTop: '2rem',
      textAlign: 'center',
    },
  }
})

const NOOP = () => null

const FolderCollection = ({
  folders = [],
  maxPerRow = 4,
  noResultsText,
  fetchMore = NOOP,
  hasMore,
}) => {
  const c = useStyles()
  if (!folders || folders.length < 1) {
    return <NoResults>{noResultsText}</NoResults>
  }

  return (
    <>
      <Grid singleRow={folders.length < maxPerRow}>
        {folders.map((folder, index) => (
          <FolderCard
            key={`folder-${folder.id}:${index}`}
            folder={folder}
            withOwner={true}
          />
        ))}
      </Grid>
      {hasMore && (
        <div className={c.FolderCollection_ShowMoreContainer}>
          <ShowMoreButton fetchMore={fetchMore} />
        </div>
      )}
    </>
  )
}

export default FolderCollection
