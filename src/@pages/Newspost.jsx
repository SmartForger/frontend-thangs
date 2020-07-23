import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { format } from 'date-fns'

import * as GraphqlService from '@services/graphql-service'
import { NewThemeLayout } from '@style'
import { Spinner } from '@components/Spinner'
import { Markdown } from '@components/Markdown'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Newspost: {},
    Newspost_Content: {
      marginTop: '.75rem',
    },
  }
})

const PostedOn = ({ date }) => {
  const dateString = new Date(date)
  const formatted = format(dateString, 'MMMM do yyyy')
  return <div>Posted on : {formatted}</div>
}

const Owner = ({ owner }) => {
  return (
    <div>
      {owner.firstName} {owner.lastName}
    </div>
  )
}

const NewspostPage = ({ newspost }) => {
  const c = useStyles()
  return (
    <div>
      <h1>{newspost.title}</h1>
      <Owner owner={newspost.owner} />
      <PostedOn date={newspost.created} />
      <Markdown className={c.Newspost_Content}>{newspost.content}</Markdown>
    </div>
  )
}

const Page = () => {
  const { id } = useParams()

  const graphqlService = GraphqlService.getInstance()
  const { loading, error, newspost } = graphqlService.useNewspostById(id)

  if (loading) {
    return <Spinner />
  } else if (!newspost) {
    return <Redirect to='/not-found' />
  } else if (error) {
    return <div>Error loading newspost</div>
  }

  return <NewspostPage newspost={newspost} />
}

export const Newspost = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
