import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer } from '@components'
import { useActionMenu } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md, md_viewer },
  } = theme
  return {
    ActionMenuPortal: {
      bottom: 0,
    },
    ActionMenuPortal_Background: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: '11',
    },
    ActionMenuPortal_Background__mobileOnly: {
      [md]: {
        opacity: '0',
        visibility: 'hidden',
      },
    },
    ActionMenuPortal_Background__mobileTablet: {
      [md_viewer]: {
        opacity: '0',
        visibility: 'hidden',
      },
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
      transition: 'all 450ms',
      marginTop: 0,
      width: '100%',

      [md]: {
        alignItems: 'baseline',
      },

      '& > div': {
        borderRadius: 0,
        height: '100%',
        width: '100%',

        [md]: {
          borderRadius: '1rem',
          height: 'auto',
        },
      },
    },
    ActionMenuContent__isVisible: {
      bottom: 0,
    },
    ActionMenuContent_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    ActionMenuContent_FullWidth: {
      width: '100%',
      overflow: 'hidden',
    },
    ActionMenuContent_NoFlex: {
      flex: 'none',
    },
  }
})

export const ActionMenuPortal = ({ actionMenuRef, className, scrollTop, mobileOnly }) => {
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
      <>
        <div
          className={classnames(c.ActionMenuPortal_Background, {
            [c.ActionMenuPortal_Background__mobileOnly]: mobileOnly,
            [c.ActionMenuPortal_Background__mobileTablet]: !mobileOnly,
          })}
        ></div>
        <div
          ref={actionMenuRef}
          className={classnames(className, c.ActionMenuPortal, {
            [c.ActionMenuPortal__isVisible]: isVisible,
          })}
        >
          <div
            className={classnames(c.ActionMenuContent, {
              [c.ActionMenuContent__isVisible]: isVisible,
            })}
          >
            <div className={c.ActionMenuContent_Row}>
              <Spacer size={'2rem'} className={c.ActionMenuContent_NoFlex} />
              <div className={c.ActionMenuContent_FullWidth}>
                <Spacer size={'2rem'} />
                {actionMenuData?.actionBarTitle?.length > 0 && (
                  <>
                    <Title headerLevel={HeaderLevel.tertiary}>
                      {actionMenuData.actionBarTitle}
                    </Title>
                    <Spacer size={'1.5rem'} />
                  </>
                )}
                <ActionMenuComponent {...actionMenuData} />
              </div>
              <Spacer size={'2rem'} className={c.ActionMenuContent_NoFlex} />
            </div>
          </div>
        </div>
      </>,
      document.querySelector('#actionMenu-root')
    )
  } else return null
}
