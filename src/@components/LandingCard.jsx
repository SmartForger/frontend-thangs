import React from 'react'
import { Spacer, TitleTertiary, MultiLineBodyText } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    LandingCard: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '4.75rem',
    },
    LandingCard_Text: {
      width: '15.125rem',

      '& h3': {
        color: theme.colors.gold[500],
      },

      '& span': {
        color: theme.colors.white[400],
      },
    },
    LandingCard_Link: {
      textDecoration: 'underline',
      display: 'inline',
      cursor: 'pointer',
    },
  }
})
const noop = () => null
const LandingCard = ({ card = {} }) => {
  const { IconComponent, title, linkText, text, callback = noop } = card
  const c = useStyles({})
  return (
    <>
      <Spacer size={'1rem'} />
      <div className={c.LandingCard}>
        <Spacer size={'1rem'} />
        <IconComponent />
        <Spacer size={'1rem'} />
        <div className={c.LandingCard_Text}>
          <TitleTertiary>{title}</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MultiLineBodyText>
            <div className={c.LandingCard_Link} onClick={callback}>
              {linkText}
            </div>{' '}
            {text}
          </MultiLineBodyText>
        </div>
        <Spacer size={'1rem'} />
      </div>
    </>
  )
}

export default LandingCard
