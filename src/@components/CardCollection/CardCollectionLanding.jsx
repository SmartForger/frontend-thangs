
import React from 'react'
import { createUseStyles } from '@style'
import CardCollectionBase from './CardCollectionBase'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xs_352, md_972, xxl_1454 },
  } = theme

  return {
    CardCollection: {
      display: 'grid',
      gap: '1rem',
      margin: '0 auto',
      width: '100%',
      justifyContent: 'center',

      gridTemplateColumns: 'repeat(auto-fit, minmax(164px, 1fr))',

      '@media (min-width: 425px)': {
        gridTemplateColumns: 'repeat(auto-fit, 164px)',
      },

      [md_972]: {
        gridTemplateColumns: 'repeat(auto-fit, 221px)',
      },

      [xxl_1454]: {
        gridTemplateColumns: 'repeat(auto-fit, 340px)',
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

const CardCollection = (
  props
) => {
  const c = useStyles({})

  return (
    <CardCollectionBase c={c} {...props} />
  )
}

export default CardCollection
