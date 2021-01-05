import React, { useCallback } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ActionMenu, Spacer, SingleLineBodyText, TextInput } from '@components'
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
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    ColorPickerMenu: {
      display: 'none',
      gap: '1rem',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',

      [md]: {
        display: 'grid',
      },

      '&:after': {
        borderLeft: 'solid 6px transparent',
        borderRight: 'solid 6px transparent',
        borderTop: `solid 8px ${theme.variables.colors.cardBackground}`,
        content: '',
        height: 0,
        left: '50%',
        position: 'absolute',
        top: 'calc(100% - 1px)',
        transform: 'translateX(-50%)',
        width: 0,
        zIndex: 1,
      },
    },
    ColorPickerMenu_Wrapper: {
      ...theme.mixins.flexColumn,
    },
    ColorPickerMenu_Input: {
      backgroundColor: theme.colors.white[700],
      border: `1px solid ${theme.colors.white[900]}`,
      borderRadius: '.5rem',
      boxSizing: 'border-box',
      padding: '.75rem',
      position: 'relative',
      width: '9rem',
    },
    ColorPickerMenu_HiddenInput: {
      height: '2.5rem',
      left: 0,
      opacity: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    ColorPickerMenu_Color: {
      borderRadius: '100%',
      boxSizing: 'border-box',
      cursor: 'pointer',
      height: '1.5rem',
      width: '1.5rem',
    },
    ColorPickerMenu__isSelected: {
      border: `1px solid ${theme.variables.colors.cardBackground}`,
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.5)',
    },
    ColorPickerTarget: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      position: 'relative',
    },
    ColorPickerTarget_ColorCircle: {
      borderRadius: '50%',
      height: '2rem',
      width: '2rem',
    },
    ColorPicker__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    ColorPicker__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const ColorPickerMenu = ({ onChange = noop, selectedValue: currentColor }) => {
  const c = useStyles({ color: currentColor })
  const handleChange = useCallback(
    e => {
      if (e && e.target) {
        onChange(e.target.value)
      }
    },
    [onChange]
  )

  return (
    <div className={c.ColorPickerMenu_Wrapper}>
      <div className={c.ColorPickerMenu_Input}>
        <TextInput
          name='color'
          type='color'
          placeholder={'#999999'}
          className={c.ColorPickerMenu_HiddenInput}
          onChange={handleChange}
        />
        <SingleLineBodyText>{currentColor}</SingleLineBodyText>
      </div>
      <Spacer size={'1rem'} />
      <div className={c.ColorPickerMenu}>
        {COLORS.map((color, idx) => {
          const isSelected = color === currentColor
          return (
            <div
              className={classnames(c.ColorPickerMenu_Color, {
                [c.ColorPickerMenu__isSelected]: isSelected,
              })}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              key={`ColorPicker_${idx}`}
            />
          )
        })}
      </div>
    </div>
  )
}

const ColorPickerTarget = ({ onClick = noop, selectedValue: color }) => {
  const c = useStyles({ color })

  return (
    <div className={c.ColorPickerTarget} onClick={onClick}>
      <div
        className={classnames(c.ColorPickerTarget_ColorCircle, c.ColorPicker__desktop)}
        style={{ backgroundColor: color }}
      />
      <ColorBucketIcon className={c.ColorPicker__mobile} />
      <Spacer size={'0.5rem'} className={c.ColorPicker__desktop} />
      <ArrowDown className={c.ColorPicker__desktop} />
    </div>
  )
}

const ColorPickerActionMenu = ({ onChange = noop, selectedValue }) => {
  return (
    <ActionMenu
      MenuComponent={ColorPickerMenu}
      MenuComponentProps={{ onChange, actionBarTitle: 'Pick a color', selectedValue }}
      TargetComponent={ColorPickerTarget}
      TargetComponentProps={{ selectedValue }}
    />
  )
}

export default ColorPickerActionMenu
