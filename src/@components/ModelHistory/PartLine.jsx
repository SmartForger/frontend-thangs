import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import {
  ContainerRow,
  ContainerColumn,
  Spacer,
  ModelHistoryPartActionMenu,
} from '@components'
import { formatBytes } from '@utilities'
import * as types from '@constants/storeEventTypes'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'

const useStyles = createUseStyles(theme => {
  return {
    PartLine: {
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: '.5rem',
      maxWidth: '30rem',
    },
  }
})

const PartLine = ({ name, sha, prevSHA, size, isInitial = false }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()

  const handleChange = useCallback(() => {
    dispatch(types.SET_COMPARE_MODELS, {
      model1: prevSHA,
      model2: sha,
    })
  }, [dispatch, prevSHA, sha])

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
              <Body>{name}</Body>
              <Spacer size={'.5rem'} />
              <Metadata type={MetadataType.secondary}>
                {!size ? '' : formatBytes(size)}
              </Metadata>
            </ContainerRow>
            {!isInitial && (
              <ContainerRow>
                <ModelHistoryPartActionMenu onChange={handleChange} />
                <Spacer size={'1rem'} />
              </ContainerRow>
            )}
          </ContainerRow>
          <Spacer size={'1rem'} />
        </ContainerColumn>
      </ContainerRow>
      <Spacer size={'.5rem'} />
    </React.Fragment>
  )
}

PartLine.displayName = 'PartLine'

export default PartLine
