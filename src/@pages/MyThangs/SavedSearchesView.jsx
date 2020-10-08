import React from 'react'
import { createUseStyles } from '@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    SavedSearches: {},
  }
})

const noop = () => null
const SavedSearches = ({ className, id, folders, setCurrentView = noop }) => {
  const c = useStyles({})
  return 'SavedSearchesView'
}

export default SavedSearches
