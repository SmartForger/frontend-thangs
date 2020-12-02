
import React from 'react'
import { createUseStyles } from '@style'
import CardCollectionBase from './CardCollectionBase'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xs_352, md_972, xxl, xxl_1454 },
  } = theme

  return {
    CardCollection: {
      display: 'grid',
      gap: '1rem',
      margin: '0 auto',
      width: '100%',
      justifyContent: 'center',

      gridTemplateColumns: 'repeat(auto-fit, minmax(164px, 1fr))',

      '@media (min-width: 470px)': {
        gridTemplateColumns: '221px 221px',
      },

      '@media (min-width: 736px)': {
        gridTemplateColumns: '164px 164px 164px 164px',
      },

      '@media (min-width: 924px)': {
        gridTemplateColumns: '221px 221px 221px 221px',
      },  

      '@media (min-width: 1096px)': {
        gridTemplateColumns: '164px 164px 164px 164px 164px 164px',
      },

      [xxl]: {
        gridTemplateColumns: '340px 340px 340px 340px',
      },
    },
    ModelCard_Skeleton: {
      paddingBottom: 0,
      [xs_352]: {
        minHeight: '17.52rem',
      },
      [md_972]: {
        minHeight: '19.2rem',
      },
      [xxl_1454]: {
        minHeight: '26.75rem',
      },

      margin: 'auto',
      width: '100%',
      borderRadius: '.5rem',
    },
  }
})

const CardCollectionLanding = (
  props
) => {
  const c = useStyles({})

  return (
    <CardCollectionBase c={c} {...props} />
  )
}

export default CardCollectionLanding
