import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Tag: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      backgroundColor: ({ color, secondary }) =>
        color ? color : secondary ? theme.colors.blue[200] : theme.colors.gold[500],
      color: theme.colors.black[500],
      borderRadius: '.25rem',
      cursor: 'pointer',
      width: 'fit-content',
    },
    Tag_Text: {
      color: ({ lightText, textColor }) =>
        textColor
          ? textColor
          : lightText
            ? theme.colors.white[400]
            : theme.colors.black[900],
      lineHeight: '.5rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      alignItems: 'flex-start',
    },
    Tag_TextWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      maxWidth: ({ maxWidth }) => maxWidth || undefined,
    },
  }
})
const noop = () => null
const Tag = ({
  children,
  className,
  color,
  textColor,
  lightText,
  secondary,
  maxWidth,
  onClick = noop,
}) => {
  const c = useStyles({ color, lightText, secondary, textColor, maxWidth })
  return (
    <div className={classnames(className, c.Tag)} onClick={onClick}>
      <Spacer size={'.25rem'} />
      <div className={c.Tag_TextWrapper}>
        <Spacer size={'.5rem'} />
        <Metadata type={MetadataType.secondary} className={c.Tag_Text}>
          {children}
        </Metadata>
        <Spacer size={'.5rem'} />
      </div>
      <Spacer size={'.25rem'} />
    </div>
  )
}

export default Tag
