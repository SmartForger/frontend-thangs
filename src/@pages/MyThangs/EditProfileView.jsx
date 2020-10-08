import React from 'react'
import { createUseStyles } from '@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    EditProfile: {},
  }
})

const noop = () => null
const EditProfile = ({ className, id, folders, setCurrentView = noop }) => {
  const c = useStyles({})
  return 'EditProfileView'
}

export default EditProfile
