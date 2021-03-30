import React from 'react'
import { ErrorMessage, Spacer, Spinner } from '@components'
import { parseSHA } from '@utilities'
import CommitNode from './CommitNode'
import PartLine from './PartLine'

const ModelHistory = ({ modelHistory = [], isLoading, isError, error }) => {
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
    return (
      <React.Fragment key={`entry_${ind}`}>
        <CommitNode
          message={entry.message}
          tag={parseSHA(entry.sha)}
          created={entry.date}
          author={entry.author}
          isActive={ind === 0}
          isInitial={history.length - 1 === ind}
        />
        <Spacer size={'.75rem'} />
        {entry.commits &&
          entry.commits.length &&
          entry.commits.map((commit, ind) => {
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
      </React.Fragment>
    )
  })
}

ModelHistory.displayName = 'ModelHistory'

export default ModelHistory
