import React from 'react'
import { Spacer, MetadataSecondary } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Tag: {
      borderRadius: '.125rem',
      backgroundColor: ({ secondary }) =>
        secondary ? theme.colors.blue[200] : theme.colors.gold[500],
    },
  }
})

const Tag = ({ secondary, children }) => {
  const c = useStyles({ secondary })

  return (
    <div className={c.Tag}>
      <Spacer size={'.25rem'} />
      <div>
        <Spacer size={'.25rem'} />
        <MetadataSecondary light>{children}</MetadataSecondary>
        <Spacer size={'.25rem'} />
      </div>
      <Spacer size={'.25rem'} />
    </div>
  )
}

export default Tag
