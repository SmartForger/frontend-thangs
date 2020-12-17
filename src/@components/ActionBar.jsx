import React, { useEffect, useState, useRef } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { useExternalClick } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    ActionBar: {
      position: 'relative',
      overflowY: 'hidden scroll',
      overflowX: 'hidden',
      outline: 'none',
      width: '100%',
      height: '100%',
      display: ({ isHidden }) => (isHidden ? 'none' : 'flex'),
      alignItems: 'center',
    },
    ActionBar_CloseButton: {
      position: 'absolute',
      right: '3rem',
      top: '3rem',
      cursor: 'pointer',
      zIndex: 2,
    },
    ActionBar_Content: {
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
        height: 'auto',
        width: ({ dialogue }) => (dialogue ? 'unset' : '90%'),
        maxWidth: ({ windowed, showPromo, smallWidth }) =>
          smallWidth ? '22.875rem' : showPromo && windowed ? '45.75rem' : '32rem',
        paddingTop: '2rem',
        margin: '0 auto',
        transition: 'all 450ms',
        opacity: ({ animateIn }) => (animateIn ? 0 : 1),
        top: ({ animateIn }) => (animateIn ? '30px' : 0),
        backgroundColor: 'unset',
      },
    },
    ActionBar_Content__visible: {
      bottom: 0,
      opacity: 1,
    },
  }
})
const noop = () => null

const ActionBar = ({ children, className, ...props }) => {
  const actionBarRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const { dispatch } = useStoreon()
  useExternalClick(actionBarRef, () => dispatch(types.CLOSE_ACTION_BAR))
  const c = useStyles()

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100)
  }, [])

  return (
    <div
      className={classnames(c.ActionBar_Content, {
        [c.ActionBar_Content__visible]: isVisible,
      })}
      ref={actionBarRef}
    >
      {children}
    </div>
  )
}

export default ActionBar
