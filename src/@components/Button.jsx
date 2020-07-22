import styled, { css } from 'styled-components/macro'
import {
  primaryButtonText,
  secondaryButtonText,
  darkButtonText,
  matchingButtonText,
  matchingButtonHoverText,
} from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Button: {
      border: 'none',
      textAlign: 'center',
      userSelect: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '.5rem',
      padding: '.5rem .75rem',
      backgroundColor: theme.colors.BLUE_2,
      ...primaryButtonText,
      ...theme.shadow,

      '&:disabled': {
        cursor: 'not-allowed',
      },

      '&:hover': {
        backgroundColor: theme.colors.BLUE_4,
      },

      '&:disabled': {
        ...secondaryButtonText,
        opacity: '0.8',
        '&:hover': {
          opacity: 1,
        },
      },
    },
    Button__secondary: {
      ...secondaryButtonText,
      backgroundColor: theme.color.GREY_3,
      '&:hover': {
        backgroundColor: theme.color.GREY_7,
      },
    },
    Button__back: {
      width: '3rem',
      height: '3rem',
      borderRadius: '3rem',
      padding: 0,
      marginRight: '1rem',
    },
    Button__dark: {
      ...darkButtonText,
      backgroundColor: theme.color.GREY_7,
      '&:hover': {
        backgroundColor: theme.color.BLACK_4,
      },
    },
    Button__text: {
      border: none,
      background: none,
      padding: 0,
      cursor: pointer,
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
    Button__brand: {
      ...matchingButtonText,
      ...theme.shadow,
      backgroundColor: theme.colors.YELLOW_1,
      padding: '.5rem 1rem',
      minWidth: '11.25rem',

      [md]: {
        padding: '.5rem 1.5rem',
      },

      '&:hover': {
        ...matchingButtonHoverText,
        backgroundColor: theme.color.YELLOW_3,
      },
    },
  }
})

export const Button = ({ secondary, back, dark, text, brand }) => {
  const c = useStyles()
  return (
    <button
      className={classnames(c.Button, {
        [c.Button__secondary]: secondary || back,
        [c.Button__back]: back,
        [c.Button__dark]: dark,
        [c.Button__text]: text,
        [c.Button__brand]: brand,
      })}
    ></button>
  )
}
