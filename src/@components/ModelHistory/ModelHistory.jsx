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

const ModelHistory = ({
  modelHistory = [],
  modelData = {},
  isLoading,
  isError,
  error,
  setActiveViewer,
}) => {
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
  const partSHAs = {}
  const newHistory = [...modelHistory]
  newHistory.forEach(version => {
    version.changes.forEach(commit => {
      if (!partSHAs[version.sha]) partSHAs[version.sha] = []
      partSHAs[version.sha].push(commit.partIdentifier)
    })
  })
  return newHistory.reverse().map((entry, ind) => {
    if (!entry.changes || entry.changes.length === 0) {
      return null
    }

    const isInitial = newHistory.length - 1 === ind
    const { changes } = entry

    return (
      <div key={`entry_${ind}`} className={c.ModelHistory}>
        <CommitNode
          message={entry.message}
          tag={entry.sha && entry.sha.substring(0, 7)}
          created={entry.created}
          author={entry.owner}
          isActive={ind === 0}
          isInitial={isInitial}
        />
        <Spacer size={'.75rem'} />
        {changes.map((commit, ind) => {
          if (!commit) return null
          const part = modelData.parts.find(
            part => part.partIdentifier === commit.partIdentifier
          )
          const partName = part?.name
          const prevSHA =
            Object.keys(partSHAs).find(sha => {
              return partSHAs[sha].includes(commit.partIdentifier)
            }) ?? '00000000-0000-0000-0000-000000000000'
          return (
            <React.Fragment key={`commit_${commit.previousPartIdentifier}_${ind}`}>
              <PartLine
                name={partName}
                size={commit.size}
                isInitial={isInitial}
                sha={entry.sha}
                prevSHA={prevSHA}
                setActiveViewer={setActiveViewer}
              />
              {changes.length - 1 === ind && <Spacer size={'.5rem'} />}
            </React.Fragment>
          )
        })}
        {!isInitial && <div className={c.AvatarConnector} />}
      </div>
    )
  })
}

ModelHistory.displayName = 'ModelHistory'

export default ModelHistory
