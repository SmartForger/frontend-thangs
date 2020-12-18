import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import {
  DropdownMenu,
  DropdownItem,
  Spacer,
  LabelText,
  SingleLineBodyText,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right.svg'
import { ReactComponent as TopViewIcon } from '@svg/view-top-icon.svg'
import { ReactComponent as FrontViewIcon } from '@svg/view-front-icon.svg'
import { ReactComponent as BackViewIcon } from '@svg/view-back-icon.svg'
import { ReactComponent as RightViewIcon } from '@svg/view-right-icon.svg'
import { ReactComponent as LeftViewIcon } from '@svg/view-left-icon.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    OrientationDropdown: {
      width: 'auto',
      right: '-1rem',
      bottom: '3.6rem',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    OrientationDropdown_ActionMenu: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    OrientationDropdown_Arrow: {
      '& > path': {},
    },
    OrientationDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    OrientationDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    OrientationDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    OrientationDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    OrientationDropdown_Item: {
      justifyContent: 'space-between',
    },
    OrientationDropdown__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    OrientationDropdown__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const options = [
  {
    label: 'Top',
    Icon: TopViewIcon,
    value: 'Top',
  },
  {
    label: 'Front',
    Icon: FrontViewIcon,
    value: 'Front',
  },
  {
    label: 'Back',
    Icon: BackViewIcon,
    value: 'Back',
  },
  {
    label: 'Right',
    Icon: RightViewIcon,
    value: 'Right',
  },
  {
    label: 'Left',
    Icon: LeftViewIcon,
    value: 'Left',
  },
]

const noop = () => null

const OrientationDropdown = ({ onClick = noop, handleChange = noop, selectedValue }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const selectedOrientation = useMemo(
    () => options.find(opt => opt.value === selectedValue).label,
    [selectedValue]
  )

  const SelectedOrientationIcon = useMemo(
    () => options.find(opt => opt.value === selectedValue).Icon,
    [selectedValue]
  )

  const handleOnClick = useCallback(() => {
    dispatch(types.OPEN_ACTION_BAR, {
      Component: OrientationActionMenu,
      data: {
        selectedValue,
        handleChange,
      },
    })
    onClick()
  }, [dispatch, handleChange, onClick, selectedValue])

  return (
    <div className={c.OrientationDropdown_ClickableButton} onClick={handleOnClick}>
      <SingleLineBodyText className={c.OrientationDropdown__desktop}>
        {selectedOrientation}
      </SingleLineBodyText>
      <SelectedOrientationIcon className={c.OrientationDropdown__mobile} />
      <Spacer size={'.5rem'} className={c.OrientationDropdown__desktop} />
      <ArrowDownIcon
        className={classnames(
          c.OrientationDropdown_Arrow,
          c.OrientationDropdown__desktop
        )}
      />
    </div>
  )
}

const OrientationMenu = ({ handleChange = noop }) => {
  const c = useStyles({})

  return (
    <>
      <Spacer className={c.OrientationDropdown__mobile} size={'2rem'} />
      <div>
        {options.map((option, ind) => {
          const { Icon = noop } = option
          return (
            <>
              <DropdownItem
                key={`drawmodes_${ind}`}
                onClick={() => handleChange(option.value)}
                className={c.OrientationDropdown_Item}
              >
                <div className={c.OrientationDropdown_Row}>
                  <Icon />
                  <Spacer size={'.75rem'} />
                  <LabelText>{option.label}</LabelText>
                </div>
                <ArrowRightIcon className={c.OrientationDropdown__mobile} />
              </DropdownItem>
              <Spacer className={c.OrientationDropdown__mobile} size={'2rem'} />
            </>
          )
        })}
      </div>
    </>
  )
}

const OrientationDropdownMenu = ({ handleChange = noop, selectedValue }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.OrientationDropdown}
      TargetComponent={OrientationDropdown}
      TargetComponentProps={{ selectedValue, handleChange }}
    >
      <OrientationMenu handleChange={handleChange} />
    </DropdownMenu>
  )
}

const OrientationActionMenu = ({ handleChange = noop }) => {
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
      <div className={c.OrientationDropdown_ActionMenu}>
        <Spacer size={'2rem'} />
        <TitleTertiary>Select orientation</TitleTertiary>
        <OrientationMenu handleChange={handleSelect} />
      </div>
      <Spacer size={'2rem'} />
    </>
  )
}

export default OrientationDropdownMenu
