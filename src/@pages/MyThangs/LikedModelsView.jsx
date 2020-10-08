import React from 'react'
import { createUseStyles } from '@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    LikeModels: {},
  }
})

const noop = () => null
const LikeModels = ({ className, id, folders, setCurrentView = noop }) => {
  const c = useStyles({})
  return 'LikeModelsView'
}

export default LikeModels
