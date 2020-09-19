import React from 'react'
import { LandingCard } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xxxl },
  } = theme
  return {
    Carousel_Wrapper: {
      width: 'calc(100% + 4rem)',
      position: 'absolute',
      overflowY: 'scroll',
      margin: '0 -2rem',

      '&::-webkit-scrollbar': {
        width: 0,
        background: 'transparent',
      },

      [xxxl]: {
        overflowY: 'visible',
        display: 'flex',
        justifyContent: 'center',
      },
    },
    Carousel: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '2rem',

      [xxxl]: {
        marginLeft: '0',
      },
    },
    Carousel_Card: {
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.16)',
      borderRadius: '.75rem',
      backgroundColor: theme.colors.white[400],
      marginRight: '2.25rem',
    },
  }
})

const Carousel = ({ className, cards = [] }) => {
  const c = useStyles({})
  return (
    <div className={classnames(className, c.Carousel_Wrapper)}>
      <ul className={c.Carousel}>
        {cards.map((card, ind) => {
          return (
            <li key={`CarouselCard_${ind}`} className={c.Carousel_Card}>
              <LandingCard card={card} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Carousel
