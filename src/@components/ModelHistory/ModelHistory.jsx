import React, { useCallback } from 'react'
import {
  ContainerRow,
  ContainerColumn,
  ErrorMessage,
  MetadataSecondary,
  Spacer,
  Spinner,
  SingleLineBodyText,
  Tag,
  ProfilePicture,
  ModelHistoryPartActionMenu,
} from '@components'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as InitialCommitIcon } from '@svg/icon-initial-commit.svg'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { formatBytes, parseSHA } from '@utilities'

const useStyles = createUseStyles(theme => {
  return {
    PartLine: {
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: '.5rem',
    },
    CommitNode_Author: {
      color: theme.colors.blue[500],
    },
  }
})

const CommitNode = ({ message, tag, created, author = {}, isActive, isInitial }) => {
  const c = useStyles()
  return (
    <ContainerRow>
      {isInitial ? (
        <InitialCommitIcon />
      ) : (
        <ProfilePicture
          size='2.5rem'
          name={author.fullName}
          userName={author.username}
          src={author.profile && author.profile.avatarUrl}
        />
      )}
      <Spacer size={'1.5rem'} />
      <ContainerColumn>
        <Spacer size={'.25rem'} />
        <ContainerRow alignItems={'center'}>
          <SingleLineBodyText>{message}</SingleLineBodyText>
          <Spacer size={'.25rem'} />
          <Tag
            color={isActive ? '#13BD98' : '#DCF7F1'}
            textColor={isActive ? '#FFFFFF' : '#00A187'}
          >
            {tag}
          </Tag>
        </ContainerRow>
        <Spacer size={'.5rem'} />
        <ContainerRow>
          <MetadataSecondary>Date {created} by </MetadataSecondary>
          <MetadataSecondary className={c.CommitNode_Author}>
            {' '}
            author {author.username}
          </MetadataSecondary>
        </ContainerRow>
      </ContainerColumn>
    </ContainerRow>
  )
}

const PartLine = ({ name, size }) => {
  const c = useStyles()

  const handleRowClick = useCallback(() => {}, [])

  return (
    <React.Fragment>
      <ContainerRow fullWidth>
        <Spacer width={'3.75rem'} height={'3rem'} />
        <ContainerColumn className={c.PartLine} fullWidth>
          <Spacer size={'1rem'} />
          <ContainerRow justifyContent={'space-between'} fullWidth>
            <ContainerRow alignItems={'center'}>
              <Spacer size={'1rem'} />
              <FileIcon />
              <Spacer size={'1rem'} />
              <SingleLineBodyText>{name}</SingleLineBodyText>
              <Spacer size={'.5rem'} />
              <MetadataSecondary>{!size ? '' : formatBytes(size)}</MetadataSecondary>
            </ContainerRow>
            <ContainerRow>
              <ModelHistoryPartActionMenu />
              <Spacer size={'1rem'} />
            </ContainerRow>
          </ContainerRow>
          <Spacer size={'1rem'} />
        </ContainerColumn>
      </ContainerRow>
      <Spacer size={'.5rem'} />
    </React.Fragment>
  )
}

const ModelHistory = ({ history = [], isLoading, isError, error }) => {
  if (isLoading) return <Spinner />
  if (isError) {
    return (
      <>
        <ErrorMessage message={error} />
        <Spacer size='1rem' />
      </>
    )
  }
  const newHistory = [...history]
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
