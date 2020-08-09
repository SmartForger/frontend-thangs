import React from 'react'
import { Header } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Layout: {
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2.5rem',
      paddingRight: '1rem',
      paddingBottom: '2rem',
      paddingLeft: '1rem',

      [md]: {
        paddingRight: '6.25rem',
        paddingLeft: '6.25rem',
      },
    },
  }
})
const noop = () => null
const Layout = ({ children, Hero = noop }) => {
  const c = useStyles()

  return (
    <>
      <Header />
      {Hero && <Hero />}
      <div className={c.Layout}>{children}</div>
    </>
  )
}

export default Layout
