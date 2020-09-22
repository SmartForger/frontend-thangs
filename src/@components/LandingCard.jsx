import React from 'react'
import { Spacer, TitleTertiary, MultiLineBodyText } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    LandingCard: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '4.75rem',
    },
    LandingCard_Text: {
      width: '15.125rem',
    },
  }
})

const LandingCard = ({ card = {} }) => {
  const { IconComponent, title, text } = card
  const c = useStyles({})
  return (
    <>
      <Spacer size={'1.5rem'} />
      <div className={c.LandingCard}>
        <Spacer size={'1.5rem'} />
        <IconComponent />
        <Spacer size={'1rem'} />
        <div className={c.LandingCard_Text}>
          <TitleTertiary>{title}</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MultiLineBodyText>{text}</MultiLineBodyText>
        </div>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'20px'} />
    </>
  )
}

export default LandingCard
