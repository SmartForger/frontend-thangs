import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'
import { Spacer } from '@components'
import { useActionMenu } from '@hooks'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    ActionMenuPortal: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      bottom: 0,
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: 10,
    },
    ActionMenuPortal__isVisible: {
      opacity: '1 !important',
      bottom: '0 !important',
    },
    ActionMenuContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      position: 'relative',
      top: '30px',
      transition: 'all 450ms',
      marginTop: 0,

      [md]: {
        alignItems: 'baseline',
        marginTop: '20vh',
      },

      '& > div': {
        borderRadius: 0,
        height: '100%',

        [md]: {
          borderRadius: '1rem',
          height: 'auto',
        },
      },
    },
    ActionMenuContent__isVisible: {
      bottom: 0,
    },
  }
})

export const ActionMenuPortal = ({ className, scrollTop }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { ActionMenuComponent, actionMenuData = {} } = useActionMenu()
  const c = useStyles()

  useEffect(() => {
    if (ActionMenuComponent) {
      setTimeout(() => {
        setIsVisible(true)
      }, 0)
    } else {
      setIsVisible(false)
    }
  }, [ActionMenuComponent, scrollTop])

  if (ActionMenuComponent) {
    return createPortal(
      <div
        className={classnames(className, c.ActionMenuPortal, {
          [c.ActionMenuPortal__isVisible]: isVisible,
        })}
      >
        <div
          className={classnames(c.ActionMenuContent, {
            [c.ActionMenuContent__isVisible]: isVisible,
          })}
        >
          <Spacer size={'1.5rem'} />
          <ActionMenuComponent {...actionMenuData} />
          <Spacer size={'1.5rem'} />
        </div>
      </div>,
      document.querySelector('#actionMenu-root')
    )
  } else return null
}
