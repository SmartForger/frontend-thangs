import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, Spacer } from '@components'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { useExternalClick, useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    DropdownMenu: {
      background: theme.colors.white[400],
      borderRadius: '.5rem',
      boxShadow: '0 1rem 2rem 0 rgba(0,0,0,0.15)',
      boxSizing: 'border-box',
      position: 'absolute',
      right: '-4rem',
      marginTop: '.5rem',
      zIndex: '2',
      overflowY: 'auto',
      opacity: '0',
      visibility: 'hidden',
      ...theme.mixins.scrollbar,
      ...theme.mixins.flexColumn,

      [md]: {
        right: '0rem',
      },
    },
    DropdownMenu__isOpen: {
      opacity: '1',
      visibility: 'visible',
    },
    DropdownMenu_Item: {
      ...theme.text.boldText,
      alignItems: 'baseline',
      lineHeight: '1.5rem',
      display: 'inline-flex',
      cursor: 'pointer',
      width: '100%',

      '& svg': {
        color: theme.colors.grey[500],
      },
    },
    DropdownMenu_ItemWrapper: {
      display: 'flex',
      flex: 'none',
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
    DropdownMenu_FullWidth: {
      width: ({ borderSize }) => `calc(100% - (${borderSize} * 2))`,
      flex: 'unset !important',
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
  const closeMenu = () => {
    setIsOpen(false)
  }
  useEffect(() => {
    if (isOpen && isAutoClosed) {
      document.addEventListener('click', closeMenu)
    }
    return () => {
      if (isOpen && isAutoClosed) {
        document.removeEventListener('click', closeMenu)
      }
    }
  }, [isAutoClosed, isOpen])
  useExternalClick(dropdownRef, closeMenu)
  return [isOpen, toggleOpen]
}
const DropdownItem = ({ children, to = '#', onClick, className, noHover = false }) => {
  const c = useStyles({ noHover })
  const { setOverlayOpen = noop } = useOverlay()

  return (
    <div className={c.DropdownMenu_ItemWrapper}>
      {onClick ? (
        <div
          className={classnames(className, c.DropdownMenu_Item)}
          onClick={e => {
            setOverlayOpen(false)
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
            setOverlayOpen(false)
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
  isExternalClosed = false,
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
    dropdownRef: isExternalClosed ? dropdownRef : null,
    isInitiallyOpen: isOpenExternal || isOpenByDefault,
    isAutoClosed,
  })
  const isOpen = !isOpenExternal ? isOpenInternal : isOpenExternal
  const c = useStyles({ borderSize, isOpen, noIcons, myThangsMenu })

  const handleOnTargetClick = useCallback(() => {
    onTargetClick()
    toggleOpen()
  }, [onTargetClick, toggleOpen])

  return (
    <div className={c.DropdownMenu_Container} ref={dropdownRef}>
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
      <div
        className={classnames(className, c.DropdownMenu, c.DropdownMenu_Row, {
          [c.DropdownMenu__isOpen]: isOpen,
        })}
      >
        <Spacer size={borderSize} />
        <div className={c.DropdownMenu_FullWidth}>
          <Spacer size={borderSize} />
          {typeof children === 'function' ? children({ toggleOpen }) : children}
          <Spacer size={borderSize} />
        </div>
        <Spacer size={borderSize} />
      </div>
    </div>
  )
}

export { DropdownItem, DropdownMenu }
