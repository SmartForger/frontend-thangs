import React from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ProfileLink: {
      ...theme.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
  }
})

const ProfileLink = ({ children, ...props }) => {
  const c = useStyles()
  return (
    <Link className={c.ProfileLink} {...props}>
      {children}
    </Link>
  )
}

export default ProfileLink
