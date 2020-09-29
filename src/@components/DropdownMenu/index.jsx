import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Button } from '@components'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    DropdownMenu: {
      background: theme.colors.white[400],
      borderRadius: '.5rem',
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      width: '12rem',
      padding: ({ noIcons }) => (noIcons ? '1.5rem 3rem' : '1rem'),
      boxSizing: 'border-box',
      position: 'absolute',
      right: '.75rem',
      marginTop: '.5rem',
      zIndex: 2,
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#C7C7C7 white',

      '&::-webkit-scrollbar': {
        width: 12,
      },
      '&::-webkit-scrollbar-track': {
        background: 'white',
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: '3px solid white',
      },
    },
    DropdownMenu_Item: {
      ...theme.text.boldText,
      lineHeight: '2rem',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',

      '& svg': {
        width: '1.5rem',
        marginRight: '.5rem',
        color: theme.colors.grey[500],
      },
    },
    DropdownMenu_ItemWrapper: {
      borderRadius: '.5rem',
      padding: '0',
      '&:hover': {
        backgroundColor: theme.colors.white[800],
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
  }
})

const useDropdownMenuState = (initialIsOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const toggleOpen = _e => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', closeMenu)
    }
    return () => {
      if (isOpen) {
        document.removeEventListener('click', closeMenu)
      }
    }
  }, [isOpen])
  return [isOpen, toggleOpen]
}
const DropdownItem = ({ children, to = '#', onClick, className }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  return (
    <div className={classnames(className, c.DropdownMenu_ItemWrapper)}>
      {onClick ? (
        <div
          className={c.DropdownMenu_Item}
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
  TargetComponent,
  children,
  className,
  noIcons,
  buttonIcon: ButtonIcon = DotStackIcon,
  isOpen: isOpenExternal = undefined,
  user,
}) => {
  const [isOpenInternal, toggleOpen] = useDropdownMenuState(isOpenExternal)
  const isOpen = isOpenExternal === undefined ? isOpenInternal : isOpenExternal
  const c = useStyles({ isOpen, noIcons })
  return (
    <div className={c.DropdownMenu_Container}>
      {TargetComponent ? (
        <TargetComponent onClick={toggleOpen} user={user} />
      ) : (
        <Button tertiary className={c.DropdownMenu_Button} onClick={toggleOpen}>
          <ButtonIcon />
        </Button>
      )}
      {isOpen && <div className={classnames(className, c.DropdownMenu)}>{children}</div>}
    </div>
  )
}

export { DropdownItem, DropdownMenu }
