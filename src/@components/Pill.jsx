import React, { useCallback } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Label } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Pill: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      backgroundColor: theme.colors.gold[500],
      color: theme.colors.black[500],
      borderRadius: '1.5rem',
      border: 'none',
      cursor: ({ disabled }) => (disabled ? 'not-allowed' : 'pointer'),
      opacity: ({ disabled }) => (disabled ? '0.8' : '1'),
      userSelect: 'none',
    },
    Pill_TextWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: 0,
      padding: 0,
    },
    PillSecondary: {
      backgroundColor: theme.colors.white[900],
    },
    PillTertiary: {
      backgroundColor: 'transparent',
      border: `2px solid ${theme.colors.black[900]}`,
    },
  }
})
const noop = () => null
const Pill = ({
  children,
  className,
  secondary,
  tertiary,
  onClick = noop,
  disabled,
  thin,
}) => {
  const c = useStyles({ disabled })

  const getOnClick = useCallback(() => {
    return disabled ? () => {} : onClick
  }, [disabled, onClick])

  return (
    <div
      className={classnames(className, c.Pill, {
        [c.PillSecondary]: secondary,
        [c.PillTertiary]: tertiary,
      })}
      onClick={getOnClick()}
    >
      {!thin && <Spacer size={'.5rem'} />}
      <div className={c.Pill_TextWrapper}>
        <Spacer size={'.75rem'} mobileSize={'.5rem'} />
        <Label small>{children}</Label>
        <Spacer size={'.75rem'} mobileSize={'.5rem'} />
      </div>
      {!thin && <Spacer size={'.5rem'} />}
    </div>
  )
}

export default Pill
