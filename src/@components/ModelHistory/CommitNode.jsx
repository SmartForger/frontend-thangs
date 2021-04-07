import React from 'react'
import { format } from 'date-fns'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { ContainerRow, ContainerColumn, Spacer, Tag, ProfilePicture } from '@components'

import { ReactComponent as InitialCommitIcon } from '@svg/icon-check.svg'

const useStyles = createUseStyles(theme => {
  return {
    CommitNode_Icon: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#DCF7F1', // To be replaced later

      '& path': {
        fill: '#30BE93', // To be replaced later
      },
    },
    CommitNode_Author: {
      color: theme.colors.blue[500],
      marginLeft: '0.25rem',
    },
  }
})

const CommitNode = ({ message, tag, created, author = {}, isActive, isInitial }) => {
  const c = useStyles()
  return (
    <ContainerRow>
      <div className={c.CommitNode_Icon}>
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
      </div>
      <Spacer size={'1.5rem'} />
      <ContainerColumn>
        <Spacer size={'.25rem'} />
        <ContainerRow alignItems={'center'}>
          <Body>{message}</Body>
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
          <Metadata type={MetadataType.secondary}>
            Date {format(new Date(created), 'MMM d, h:mm a')} by
          </Metadata>
          <Metadata type={MetadataType.secondary} className={c.CommitNode_Author}>
            {author.username}
          </Metadata>
        </ContainerRow>
      </ContainerColumn>
    </ContainerRow>
  )
}

CommitNode.displayName = 'CommitNode'

export default CommitNode
