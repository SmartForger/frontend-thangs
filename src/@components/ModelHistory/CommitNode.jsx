import React from 'react'
import {
  ContainerRow,
  ContainerColumn,
  MetadataSecondary,
  Spacer,
  SingleLineBodyText,
  Tag,
  ProfilePicture,
} from '@components'
import { ReactComponent as InitialCommitIcon } from '@svg/icon-initial-commit.svg'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  return {
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

CommitNode.displayName = 'CommitNode'

export default CommitNode
