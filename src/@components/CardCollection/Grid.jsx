import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(21.5rem, 1fr))',
      gap: '1rem',
      width: '100%',
    },
    Grid__singleRow: {
      gridTemplateColumns: 'repeat(auto-fill 21.5rem)',
    },
  }
})

const Grid = ({ children, singleRow }) => {
  const c = useStyles()
  return (
    <div className={classnames(c.Grid, { [c.Grid__singleRow]: singleRow })}>
      {children}
    </div>
  )
}

export default Grid
