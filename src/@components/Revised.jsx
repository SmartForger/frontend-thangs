import React from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { createUseStyles } from '@style'
import * as GraphqlService from '@services/graphql-service'
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg'
import useCollectionFetchOnce from '@services/store-service/hooks/useCollectionFetchOnce'
import { Spinner } from './Spinner'

const graphqlService = GraphqlService.getInstance()

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
      marginBottom: '2rem',
      alignItems: 'center',

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
  const { atom: model } = useCollectionFetchOnce(modelId, 'model')

  const { loading: userLoading, user } = graphqlService.useUserById(
    R.path(['data', 'ownerId'], model)
  )

  if (userLoading || model.isLoading) {
    return <Spinner />
  }

  return (
    <div className={c.Revised_Label}>
      <VersionIcon className={c.Revised_VersionIcon} />
      <div>Revised from</div>
      <Link to={`/model/${modelId}`}>{(user && user.fullName) || 'unknown'}</Link>
    </div>
  )
}

export default Revised
