import React, { useCallback, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Button, Spacer } from '@components'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { useExternalClick } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    DropdownMenu: {
      background: theme.colors.white[400],
      borderRadius: '.5rem',
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      boxSizing: 'border-box',
      position: 'absolute',
      right: '-6.5rem',
      marginTop: '.5rem',
      zIndex: 2,
      overflowY: 'auto',
      ...theme.mixins.scrollbar,
      ...theme.mixins.flexColumn,

      [md]: {
        right: '0rem',
      },
    },
    DropdownMenu_Item: {
      ...theme.text.boldText,
      lineHeight: '1.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',

      '& svg': {
        color: theme.colors.grey[500],
      },
    },
    DropdownMenu_ItemWrapper: {
      borderRadius: '.5rem',
      padding: '0',
      '&:hover': {
        backgroundColor: ({ noHover }) => (noHover ? 'none' : theme.colors.white[800]),
      },
    },
    DropdownMenu_Container: {
      position: 'relative',
      width: 'fit-content',
    },
    DropdownMenu_Button: {
      display: 'flex',
      alignItems: 'center',
    },
    DropdownMenu_Row: {
      ...theme.mixins.flexRow,
    },
  }
})

const noop = () => null

const useDropdownMenuState = ({
  dropdownRef,
  isInitiallyOpen = false,
  isAutoClosed = true,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen)
  const toggleOpen = useCallback(
    _e => {
      setIsOpen(!isOpen)
    },
    [isOpen]
  )
  const closeMenu = () => setIsOpen(false)
  useExternalClick(dropdownRef, () => {
    if (isAutoClosed) closeMenu()
  })
  return [isOpen, toggleOpen]
}
const DropdownItem = ({ children, to = '#', onClick, className, noHover = false }) => {
  const c = useStyles({ noHover })
  const { dispatch } = useStoreon()

  return (
    <div className={c.DropdownMenu_ItemWrapper}>
      {onClick ? (
        <div
          className={classnames(className, c.DropdownMenu_Item)}
          onClick={e => {
            dispatch(types.CLOSE_OVERLAY)
            onClick && onClick(e)
          }}
        >
          {children}
        </div>
      ) : (
        <Link
          className={c.DropdownMenu_Item}
          to={to}
          onClick={e => {
            dispatch(types.CLOSE_OVERLAY)
            onClick && onClick(e)
          }}
        >
          {children}
        </Link>
      )}
    </div>
  )
}

const DropdownMenu = ({
  Icon,
  TargetComponent,
  TargetComponentProps,
  buttonIcon: ButtonIcon = DotStackIcon,
  borderSize = '1rem',
  children,
  className,
  iconOnly,
  isAutoClosed = true,
  isOpen: isOpenExternal = undefined,
  isOpenByDefault = false,
  label,
  myThangsMenu,
  noIcons,
  onTargetClick = noop,
  user,
}) => {
  const dropdownRef = useRef(null)
  const [isOpenInternal, toggleOpen] = useDropdownMenuState({
    dropdownRef,
    isInitiallyOpen: isOpenExternal || isOpenByDefault,
    isAutoClosed,
  })
  const isOpen = !isOpenExternal ? isOpenInternal : isOpenExternal
  const c = useStyles({ isOpen, noIcons, myThangsMenu })

  const handleOnTargetClick = useCallback(() => {
    onTargetClick()
    toggleOpen()
  }, [onTargetClick, toggleOpen])

  return (
    <div className={c.DropdownMenu_Container}>
      {TargetComponent ? (
        <TargetComponent
          className={c.DropdownMenu_TargetComponent}
          onClick={handleOnTargetClick}
          user={user}
          myThangsMenu={myThangsMenu}
          label={label}
          Icon={Icon}
          iconOnly={iconOnly}
          isOpen={isOpen}
          {...TargetComponentProps}
        />
      ) : (
        <Button tertiary className={c.DropdownMenu_Button} onClick={toggleOpen}>
          <ButtonIcon />
        </Button>
      )}
      {isOpen && (
        <div className={classnames(className, c.DropdownMenu)}>
          <Spacer size={borderSize} />
          <div className={c.DropdownMenu_Row}>
            <Spacer size={borderSize} />
            {children}
            <Spacer size={borderSize} />
          </div>
          <Spacer size={borderSize} />
        </div>
      )}
    </div>
  )
}

export { DropdownItem, DropdownMenu }
