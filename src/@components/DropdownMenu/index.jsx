import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'
import { boldText } from '../../@style/text'
import { ReactComponent as DotStackIcon } from '../../@svg/dot-stack-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    DropdownMenu: {
      background: theme.colors.white[400],
      borderRadius: '0 0 .5rem .5rem',
      boxShadow: '0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
      width: '16.25rem',
      padding: ({ noIcons }) => (noIcons ? '24px 48px' : '24px'),
      boxSizing: 'border-box',
      position: 'absolute',
      right: '.75rem',
      marginTop: '.5rem',
      zIndex: 2,
    },
    DropdownMenu_Item: {
      ...boldText,
      lineHeight: '2rem',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',

      '& svg': {
        width: '1.5rem',
        marginRight: '.5rem',
        color: theme.colors.grey[500],
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

export const DropdownItem = ({ children, to = '#', onClick }) => {
  const c = useStyles({})
  return (
    <div>
      <Link
        className={c.DropdownMenu_Item}
        to={to}
        onClick={onClick}
        as={onClick && 'div'}
      >
        {children}
      </Link>
    </div>
  )
}

export const DropdownMenu = ({
  children,
  className,
  noIcons,
  buttonIcon: ButtonIcon = DotStackIcon,
  isOpen: isOpenExternal = undefined,
}) => {
  const [isOpenInternal, toggleOpen] = useDropdownMenuState(isOpenExternal)
  const isOpen = isOpenExternal === undefined ? isOpenInternal : isOpenExternal
  const c = useStyles({ isOpen, noIcons })
  return (
    <div className={classnames(className, c.DropdownMenu_Container)}>
      <Button text className={c.DropdownMenu_Button} onClick={toggleOpen}>
        <ButtonIcon />
      </Button>
      {isOpen && (
        <div className={c.DropdownMenu} noIcons={noIcons}>
          {children}
        </div>
      )}
    </div>
  )
}

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
