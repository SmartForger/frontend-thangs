import React, { useCallback } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ActionMenu, Spacer, TextInput } from '@components'
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
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '1rem',

      [md]: {
        display: 'grid',
      },

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
    ColorPickerMenu_Wrapper: {
      ...theme.mixins.flexColumn,
    },
    ColorPickerMenu_FormInput: {
      width: '9rem',
    },
    ColorPickerMenu_Color: {
      cursor: 'pointer',
      height: '1.5rem',
      width: '1.5rem',
      borderRadius: '100%',
      boxSizing: 'border-box',
    },
    ColorPickerMenu__isSelected: {
      border: `1px solid ${theme.variables.colors.cardBackground}`,
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.5)',
    },
    ColorPickerTarget: {
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    ColorPickerTarget_ColorCircle: {
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
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

const ColorPickerMenu = ({ selectedValue: currentColor, onChange = noop }) => {
  const c = useStyles({ color: currentColor })
  const handleBlur = useCallback(
    (e, value) => {
      debugger
      onChange(value)
    },
    [onChange]
  )

  return (
    <div className={c.ColorPickerMenu_Wrapper}>
      <TextInput
        name='color'
        type='text'
        placeholder={'#999999'}
        className={c.ColorPickerMenu_FormInput}
        onBlur={handleBlur}
      />
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
      MenuComponentProps={{ onChange, actionBarTitle: 'Pick a color' }}
      TargetComponent={ColorPickerTarget}
      TargetComponentProps={{ selectedValue }}
    />
  )
}

export default ColorPickerActionMenu
