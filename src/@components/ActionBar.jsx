import React, { useEffect, useState, useRef } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { useExternalClick } from '@hooks'
import { TitleTertiary, Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    ActionBar: {
      width: '100%',
      backgroundColor: theme.colors.white[300],
      overflow: 'auto',
      opacity: 0,
      position: 'fixed',
      zIndex: 3,
      bottom: '-200px',
      borderRadius: '1rem 1rem 0 0',
      transition: 'all .4s',
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
    ActionBar__visible: {
      bottom: 0,
      opacity: 1,
    },
    ActionBar_ActionMenu: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  }
})

const ActionBar = ({ children, actionBarTitle }) => {
  const actionBarRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const { dispatch } = useStoreon()
  useExternalClick(actionBarRef, () => dispatch(types.CLOSE_ACTION_BAR))
  const c = useStyles({})

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  return (
    <div
      className={classnames(c.ActionBar, {
        [c.ActionBar__visible]: isVisible,
      })}
      ref={actionBarRef}
    >
      <Spacer size={'2rem'} />
      <div className={c.ActionBar_ActionMenu}>
        <Spacer size={'2rem'} />
        <TitleTertiary>{actionBarTitle}</TitleTertiary>
        <Spacer size={'2rem'} />
        {children}
      </div>
      <Spacer size={'2rem'} />
    </div>
  )
}

export default ActionBar
