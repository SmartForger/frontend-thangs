import React from 'react'
import classnames from 'classnames'
import { LabelText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MetadataSecondary } from './Text/Metadata'

const useStyles = createUseStyles(theme => {
  return {
    Badge: {
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
    Badge_Text: {
      color: theme.colors.black[900],
      lineHeight: '.5rem',
    },
    Badge_TextWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: 0,
      padding: 0,
    },
    BadgeSecondary: {
      backgroundColor: theme.colors.blue[200],
    },
  }
})
const noop = () => null
const Badge = ({ children, className, secondary, onClick = noop }) => {
  const c = useStyles({})
  return (
    <div
      className={classnames(className, c.Badge, { [c.BadgeSecondary]: secondary })}
      onClick={onClick}
    >
      <Spacer size={'.25rem'} />
      <div className={c.Badge_TextWrapper}>
        <Spacer size={'.5rem'} />
        <MetadataSecondary className={c.Badge_Text}>{children}</MetadataSecondary>
        <Spacer size={'.5rem'} />
      </div>
      <Spacer size={'.25rem'} />
    </div>
  )
}

export default Badge
