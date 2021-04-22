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
  const reversedHistory = [...modelHistory].reverse()
  return reversedHistory.map((commit, ind) => {
    if (!commit.changes || commit.changes.length === 0) {
      return null
    }

    const isInitial = reversedHistory.length - 1 === ind
    const { changes } = commit

    return (
      <div key={`commit_${ind}`} className={c.ModelHistory}>
        <CommitNode
          message={commit.message}
          tag={commit.sha && commit.sha.substring(0, 7)}
          created={commit.created}
          author={commit.owner}
          isActive={ind === 0}
          isInitial={isInitial}
        />
        <Spacer size={'.75rem'} />
        {changes.map((change, ind) => {
          if (!change) return null
          const part =
            modelData.parts.find(part => part.partIdentifier === change.partIdentifier) ||
            {}
          const partName = part?.name
          const initialCommit = '00000000-0000-0000-0000-000000000000'
          const phynId = change.phyndexerId
          let prevPhynId
          reversedHistory.slice(ind + 1).find(commit => {
            return commit.changes.find(change => {
              if (change.partIdentifier === part.partIdentifier) {
                prevPhynId = change.phyndexerId
                return true
              } else if (
                change.filename === part.filename &&
                commit.sha === initialCommit
              ) {
                prevPhynId = change.phyndexerId
                return true
              }
            })
          })
          return (
            <React.Fragment key={`change_${change.previousPartIdentifier}_${ind}`}>
              <PartLine
                name={partName}
                size={change.size}
                isInitial={isInitial}
                phynId={phynId}
                prevPhynId={prevPhynId}
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
