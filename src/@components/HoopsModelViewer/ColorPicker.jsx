import React, { useState, useCallback } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { Spacer } from '@components'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ColorBucketIcon } from '@svg/icon-color-bucket.svg'
const COLORS = [
  '#dbdbdf',
  '#88888b',
  '#464655',
  '#1cb2f5',
  '#014d7c',
  '#ffbc00',
  '#b18002',
  '#c7eeff',
]

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    ColorPicker: {
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    ColorPicker_BlockPicker: {
      display: ({ visible }) => (visible ? 'grid' : 'none'),
      backgroundColor: theme.variables.colors.cardBackground,
      position: 'absolute',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '.75rem',
      padding: '1.5rem',
      bottom: '5.1rem',
      left: '1rem',
      transform: 'translateX(-50%)',
      borderRadius: '.25rem',
      boxShadow: theme.variables.boxShadow,

      '&:after': {
        content: '',
        position: 'absolute',
        top: 'calc(100% - 1px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderTop: `solid 8px ${theme.variables.colors.cardBackground}`,
        borderLeft: 'solid 6px transparent',
        borderRight: 'solid 6px transparent',
        zIndex: 1,
      },
    },
    ColorPicker_Color: {
      cursor: 'pointer',
      height: '1.5rem',
      width: '1.5rem',
      borderRadius: '100%',
      boxSizing: 'border-box',
    },
    ColorPicker_ColorCircle: {
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
    },
    ColorPicker__isSelected: {
      border: `1px solid ${theme.variables.colors.cardBackground}`,
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.5)',
    },
    ColorPicker__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    ColorPicker__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const BlockPicker = ({ currentColor, onChange, visible }) => {
  const c = useStyles({ visible, color: currentColor })
  return (
    <div className={c.ColorPicker_BlockPicker} visible={visible}>
      {COLORS.map((color, idx) => {
        const isSelected = color === currentColor
        return (
          <div
            className={classnames(c.ColorPicker_Color, {
              [c.ColorPicker__isSelected]: isSelected,
            })}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            key={idx}
          />
        )
      })}
    </div>
  )
}

const ColorPicker = ({ color = '#FFFFFF', onChange }) => {
  const [visible, setVisible] = useState()
  const c = useStyles({ visible, color })

  const toggleVisible = useCallback(() => {
    setVisible(!visible)
  }, [visible])

  const handleChange = useCallback(
    (...args) => {
      onChange(...args)
      toggleVisible()
    },
    [onChange, toggleVisible]
  )

  return (
    <div className={c.ColorPicker} onClick={toggleVisible}>
      <BlockPicker currentColor={color} onChange={handleChange} visible={visible} />
      <div
        className={classnames(c.ColorPicker_ColorCircle, c.ColorPicker__desktop)}
        style={{ backgroundColor: color }}
      />
      <ColorBucketIcon className={c.ColorPicker__mobile} />
      <Spacer size={'0.5rem'} className={c.ColorPicker__desktop} />
      <ArrowDown className={c.ColorPicker__desktop} />
    </div>
  )
}

export default ColorPicker
