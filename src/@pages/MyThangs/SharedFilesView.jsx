import React from 'react'
import { createUseStyles } from '@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    SharedFiles: {},
  }
})

const noop = () => null
const SharedFiles = ({ className, id, folders, setCurrentView = noop }) => {
  const c = useStyles({})
  return 'SharedFilesView'
}

export default SharedFiles
