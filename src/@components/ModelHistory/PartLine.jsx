import React from 'react'
import {
  ContainerRow,
  ContainerColumn,
  MetadataSecondary,
  Spacer,
  SingleLineBodyText,
  ModelHistoryPartActionMenu,
} from '@components'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { formatBytes } from '@utilities'

const useStyles = createUseStyles(theme => {
  return {
    PartLine: {
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: '.5rem',
    },
  }
})

const PartLine = ({ name, size }) => {
  const c = useStyles()

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

PartLine.displayName = 'PartLine'

export default PartLine
