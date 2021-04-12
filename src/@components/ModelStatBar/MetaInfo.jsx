import React from 'react'
import { createUseStyles, Title, Label, Spacer } from '@physna/voxel-ui'
import { ContainerColumn, ContainerRow } from '@components'
import { numberWithCommas } from '@utilities'

const useStyles = createUseStyles(_theme => {
  return {
    MetaInfo_Icon: {
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.75rem',
      borderRadius: '50%',
    },
    MetaInfo_Title: {
      lineHeight: '1.25rem',
    },
    MetaInfo_Label: {
      color: theme.colors.grey[400],
    },
  }
})

const MetaInfo = ({ label, value, icon, iconColor, className }) => {
  const c = useStyles()

  return (
    <ContainerRow className={className} alignItems='center'>
      <div className={c.MetaInfo_Icon} style={{ backgroundColor: iconColor }}>
        {icon}
      </div>
      <ContainerColumn>
        <Title className={c.MetaInfo_Title} headerLevel='h3'>
          {numberWithCommas(value)}
        </Title>
        <Spacer size='0.25rem' />
        <Label className={c.MetaInfo_Label} small>
          {label}
        </Label>
      </ContainerColumn>
    </ContainerRow>
  )
}

export default MetaInfo
