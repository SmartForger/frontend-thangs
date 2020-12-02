import React from 'react'
import { createUseStyles } from '@style'
import CardCollectionBase from './CardCollectionBase'

const useStyles = createUseStyles(_theme => {
  return {
    CardCollection: {
      display: 'grid',
      gap: '1rem',
      margin: '0 auto',
      width: '100%',

      gridTemplateColumns: 'repeat(auto-fit, minmax(164px, 1fr))',

      '@media (min-width: 786px)': {
        gridTemplateColumns: '221px 221px',
      },

      '@media (min-width: 1036px)': {
        gridTemplateColumns: '164px 164px 164px 164px',
      },

      '@media (min-width: 1260px)': {
        gridTemplateColumns: '221px 221px 221px 221px',
      },  

      '@media (min-width: 1440px)': {
        gridTemplateColumns: '164px 164px 164px 164px 164px 164px',
      },
    },
    ModelCard_Skeleton: {
      paddingBottom: 0,

      '@media (min-width: 786px)': {
        minHeight: '19.2rem',
      },

      '@media (min-width: 1036px)': {
        minHeight: '17.52rem',
      },

      '@media (min-width: 1260px)': {
        minHeight: '19.2rem',
      },  

      '@media (min-width: 1440px)': {
        minHeight: '17.52rem',
      },
      
      margin: 'auto',
      width: '100%',
      borderRadius: '.5rem',
    },
  }
})

const CardCollectionPortfolio = (
  props
) => {
  const c = useStyles({})

  return (
    <CardCollectionBase c={c} {...props} />
  )
}

export default CardCollectionPortfolio
