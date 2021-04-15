import React from 'react'
import { Spacer, Spinner } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import ErrorMessage from '../ErrorMessage'
import CommitNode from './CommitNode'
import PartLine from './PartLine'

const useStyles = createUseStyles(theme => {
  return {
    ModelHistory: {
      width: '100%',
      marginTop: '1.5rem',
      position: 'relative',
    },
    AvatarConnector: {
      position: 'relative',
      width: 0,
      height: '100%',
      borderLeft: `1px solid ${theme.colors.white[900]}`,
      top: 'calc(-100% + 2rem)',
      left: '1.25rem',
      zIndex: -1,
    },
  }
})

const ModelHistory = ({ modelHistory = [], isLoading, isError, error }) => {
  const c = useStyles()

  if (isLoading) return <Spinner />
  if (isError) {
    return (
      <>
        <ErrorMessage message={error} />
        <Spacer size='1rem' />
      </>
    )
  }
  const newHistory = [...modelHistory]
  return newHistory.reverse().map((entry, ind) => {
    if (!entry.commits || entry.commits.length === 0) {
      return null
    }

    const isInitial = newHistory.length - 1 === ind

    return (
      <div key={`entry_${ind}`} className={c.ModelHistory}>
        <CommitNode
          message={entry.message}
          tag={entry.sha && entry.sha.substring(0, 7)}
          created={entry.commits[0].created}
          author={entry.commits[0].owner}
          isActive={ind === 0}
          isInitial={isInitial}
        />
        <Spacer size={'.75rem'} />
        {entry.commits.map((commit, ind) => {
          if (!commit || !commit.name) return null
          return (
            <PartLine
              key={`commit_${commit.previousPartIdentifier}_${ind}`}
              name={commit.name}
              size={commit.size}
            />
          )
        })}
        <Spacer size={'1.5rem'} />
        {!isInitial && <div className={c.AvatarConnector} />}
      </div>
    )
  })
}

ModelHistory.displayName = 'ModelHistory'

export default ModelHistory
