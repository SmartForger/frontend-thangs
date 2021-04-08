import React from 'react'
import classnames from 'classnames'
import { createUseStyles, Title, Label, Spacer } from '@physna/voxel-ui'
import { ContainerColumn, ContainerRow } from '@components'

const useStyles = createUseStyles(theme => {
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
        <Title headerLevel='h3'>{value}</Title>
        <Spacer size='0.25rem' />
        <Label>{label}</Label>
      </ContainerColumn>
    </ContainerRow>
  )
}

export default MetaInfo
