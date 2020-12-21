import React, { useState, useRef, useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { Spacer, TitleTertiary } from '@components'
import { useExternalClick } from '@hooks'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ColorBucketIcon } from '@svg/icon-color-bucket.svg'
import * as types from '@constants/storeEventTypes'

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
    ColorPicker: {
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    ColorPicker_BlockPicker: {
      display: 'none',
      backgroundColor: theme.variables.colors.cardBackground,
      position: 'absolute',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '.75rem',
      padding: '1.5rem',
      bottom: '4.2rem',
      left: '-1.5rem',
      transform: 'translateX(-50%)',
      borderRadius: '.5rem',
      boxShadow: theme.variables.boxShadow,

      [md]: {
        display: ({ visible }) => (visible ? 'grid' : 'none'),
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
    ColorPicker_ActionMenu: {
      width: '100%',

      '& > div': {
        display: 'flex',
        position: 'relative',
        left: 0,
        bottom: 0,
        boxShadow: 'none',
        transform: 'none',
        paddingLeft: 0,
        paddingRight: 0,
        justifyContent: 'space-between',

        [md]: {
          display: 'none',
        },
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

const BlockPicker = ({ currentColor, handleChange = noop, visible, pickerRef }) => {
  const c = useStyles({ visible, color: currentColor })

  return (
    <div ref={pickerRef} className={c.ColorPicker_BlockPicker}>
      {COLORS.map((color, idx) => {
        const isSelected = color === currentColor
        return (
          <div
            className={classnames(c.ColorPicker_Color, {
              [c.ColorPicker__isSelected]: isSelected,
            })}
            style={{ backgroundColor: color }}
            onClick={() => handleChange(color)}
            key={idx}
          />
        )
      })}
    </div>
  )
}

const BlockPickerActionMenu = ({ handleChange = noop }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const handleSelect = useCallback(
    value => {
      handleChange(value)
      dispatch(types.CLOSE_ACTION_BAR)
    },
    [dispatch, handleChange]
  )

  return (
    <>
      <Spacer size={'2rem'} />
      <div className={c.ColorPicker_ActionMenu}>
        <Spacer size={'2rem'} />
        <TitleTertiary>Pick a color</TitleTertiary>
        <BlockPicker handleChange={handleSelect} />
        <Spacer size={'2rem'} />
      </div>
      <Spacer size={'2rem'} />
    </>
  )
}

const ColorPicker = ({ color = '#FFFFFF', onChange }) => {
  const [visible, setVisible] = useState()
  const c = useStyles({ visible, color })
  const { dispatch } = useStoreon()
  const pickerRef = useRef(null)

  useExternalClick(pickerRef, () => setVisible(false))

  const toggleVisible = useCallback(() => {
    if (!visible) {
      dispatch(types.OPEN_ACTION_BAR, {
        Component: BlockPickerActionMenu,
        data: {
          selectedValue: color,
          handleChange: onChange,
        },
      })
    }
    setVisible(!visible)
  }, [color, dispatch, onChange, visible])

  const handleChange = useCallback(
    (...args) => {
      onChange(...args)
      toggleVisible()
    },
    [onChange, toggleVisible]
  )

  return (
    <div className={c.ColorPicker} ref={pickerRef} onClick={toggleVisible}>
      <BlockPicker currentColor={color} handleChange={handleChange} visible={visible} />
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
