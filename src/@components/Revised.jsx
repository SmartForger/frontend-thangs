import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createUseStyles } from '@style'
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg'
import * as types from '@constants/storeEventTypes'
import { Spinner } from '@components'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(theme => {
  return {
    Revised: {},
    Revised_VersionLinkText: {
      ...theme.text.linkText,
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
  const {
    dispatch,
    [`model-${modelId}`]: modelAtom = {},
  } = useStoreon(`model-${modelId}`)

  useEffect(() => {
    dispatch(types.FETCH_MODEL, { id: modelId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (modelAtom.isLoading) {
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
