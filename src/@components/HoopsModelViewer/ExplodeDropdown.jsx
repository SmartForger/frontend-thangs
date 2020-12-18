import React, { useCallback } from 'react'
import {
  DropdownMenu,
  DropdownItem,
  Spacer,
  Slider,
  MetadataSecondary,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExplodeIcon } from '@svg/icon-explode.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, lg },
  } = theme
  return {
    ExplodeDropdown: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-7rem',
      bottom: '4.25rem',
      display: 'flex',

      [lg]: {
        display: 'none',
      },
    },
    ExplodeDropdown_ActionMenu: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    ExplodeDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ExplodeDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    ExplodeDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ExplodeDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
    ExplodeDropdown_Item: {
      justifyContent: 'space-between',
    },
    ExplodeDropdown__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    ExplodeDropdown__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
    ExplodeDropdown__medium: {
      display: 'flex',

      [lg]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const ExplodeDropdown = ({ onClick = noop }) => {
  const c = useStyles({})

  const handleOnClick = useCallback(() => {
    onClick()
  }, [onClick])

  return (
    <div className={c.ExplodeDropdown_ClickableButton} onClick={handleOnClick}>
      <MetadataSecondary className={c.ExplodeDropdown__desktop}>
        Explode
      </MetadataSecondary>
      <ExplodeIcon className={c.ExplodeDropdown__mobile} />
      <div className={c.ExplodeDropdown__medium}>
        <Spacer size={'.5rem'} className={c.ExplodeDropdown__desktop} />
        <ArrowDownIcon className={c.ExplodeDropdown__desktop} />
      </div>
    </div>
  )
}

const ExplodeMenu = ({ handleSliderChange = noop, magnitude }) => {
  const c = useStyles({})

  return (
    <>
      <Spacer className={c.ExplodeDropdown__mobile} size={'.5rem'} />
      <div>
        <DropdownItem className={c.ExplodeDropdown_Item}>
          <div className={c.ExplodeDropdown_Row}>
            <Slider onChange={handleSliderChange} steps={30} value={magnitude} />
          </div>
        </DropdownItem>
      </div>
      <Spacer className={c.ExplodeDropdown__mobile} size={'.5rem'} />
    </>
  )
}

const ExplodeDropdownMenu = ({ className, handleChange = noop, selectedValue }) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={classnames(c.ExplodeDropdown, className)}
      TargetComponent={ExplodeDropdown}
    >
      <ExplodeMenu handleSliderChange={handleChange} magnitude={selectedValue} />
    </DropdownMenu>
  )
}

export default ExplodeDropdownMenu
