import React, { useMemo } from 'react'
import {
  DropdownMenu,
  DropdownItem,
  Spacer,
  LabelText,
  SingleLineBodyText,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as TopViewIcon } from '@svg/view-top-icon.svg'
import { ReactComponent as FrontViewIcon } from '@svg/view-front-icon.svg'
import { ReactComponent as BackViewIcon } from '@svg/view-back-icon.svg'
import { ReactComponent as RightViewIcon } from '@svg/view-right-icon.svg'
import { ReactComponent as LeftViewIcon } from '@svg/view-left-icon.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    OrientationDropdown: {
      width: 'auto',
      right: '-1rem',
      bottom: '3.6rem',
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
    },
    OrientationDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
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

const OrientationDropdown = ({ onClick = noop, selectedValue }) => {
  const c = useStyles({})

  const selectedOrientation = useMemo(
    () => options.find(opt => opt.value === selectedValue).label,
    [selectedValue]
  )

  const SelectedOrientationIcon = useMemo(
    () => options.find(opt => opt.value === selectedValue).Icon,
    [selectedValue]
  )

  return (
    <div className={c.OrientationDropdown_ClickableButton} onClick={onClick}>
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

const OrientationDropdownMenu = ({ handleChange = noop, selectedValue }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={c.OrientationDropdown}
      TargetComponent={OrientationDropdown}
      TargetComponentProps={{ selectedValue }}
    >
      <div>
        {options.map((option, ind) => {
          const { Icon = noop } = option
          return (
            <DropdownItem key={`views_${ind}`} onClick={() => handleChange(option.value)}>
              <div className={c.OrientationDropdown_Row}>
                <Icon />
                <Spacer size={'.75rem'} />
                <LabelText>{option.label}</LabelText>
              </div>
            </DropdownItem>
          )
        })}
      </div>
    </DropdownMenu>
  )
}

export default OrientationDropdownMenu
