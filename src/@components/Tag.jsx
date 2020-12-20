import React from 'react'
import classnames from 'classnames'
import { Spacer } from '@components'
import { createUseStyles } from '@style'
import { MetadataSecondary } from './Text/Metadata'

const useStyles = createUseStyles(theme => {
  return {
    Tag: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      backgroundColor: theme.colors.gold[500],
      color: theme.colors.black[500],
      borderRadius: '.125rem',
      cursor: 'pointer',
    },
    Tag_Text: {
      color: theme.colors.black[900],
      lineHeight: '.5rem',
    },
    Tag_TextWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: 0,
      padding: 0,
    },
    Tag_Secondary: {
      backgroundColor: theme.colors.blue[200],
    },
  }
})
const noop = () => null
const Tag = ({ children, className, secondary, onClick = noop }) => {
  const c = useStyles({})
  return (
    <div
      className={classnames(className, c.Tag, { [c.Tag_Secondary]: secondary })}
      onClick={onClick}
    >
      <Spacer size={'.25rem'} />
      <div className={c.Tag_TextWrapper}>
        <Spacer size={'.5rem'} />
        <MetadataSecondary className={c.Tag_Text}>{children}</MetadataSecondary>
        <Spacer size={'.5rem'} />
      </div>
      <Spacer size={'.25rem'} />
    </div>
  )
}

export default Tag
