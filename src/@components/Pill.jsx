import React, { useCallback } from 'react'
import classnames from 'classnames'
import { LabelText, Spacer } from '@components'
import { createUseStyles } from '@style'

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
      border: `2px solid ${theme.colors.gold[500]}`,
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
      backgroundColor: 'transparent',
      border: `2px solid ${theme.colors.black[500]}`,
    },
    PillTertiary: {
      backgroundColor: theme.colors.white[900],
      border: `2px solid ${theme.colors.white[900]}`,
    },
  }
})
const noop = () => null
const Pill = ({ children, className, secondary, tertiary, onClick = noop, disabled }) => {
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
      <Spacer size={'.5rem'} />
      <div className={c.Pill_TextWrapper}>
        <Spacer size={'.75rem'} mobileSize={'.5rem'} />
        <LabelText small>{children}</LabelText>
        <Spacer size={'.75rem'} mobileSize={'.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
    </div>
  )
}

export default Pill
