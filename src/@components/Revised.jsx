import React from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg'
import { useServices } from '@hooks'
import { Spinner } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Revised: {},
    Revised_VersionLinkText: {
      ...theme.mixins.text.linkText,
    },
    Revised_VersionIcon: {
      width: '1.25rem',
      height: '1.25rem',
    },
    Revised_Label: {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',

      '& *:not(:first-child)': {
        marginLeft: '.25rem',
      },

      '& path, & polygon': {
        fill: theme.colors.grey[700],
      },
    },
  }
})

const Revised = ({ modelId }) => {
  const c = useStyles()
  const { useFetchOnce } = useServices()
  const { atom: model } = useFetchOnce(modelId, 'model')

  if (model.isLoading) {
    return <Spinner />
  }

  return (
    <div className={c.Revised_Label}>
      <VersionIcon className={c.Revised_VersionIcon} />
      <div>Revised from</div>
      <Link to={`/model/${modelId}`}>{`#${modelId}` || 'unknown'}</Link>
    </div>
  )
}

export default Revised
