import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const NEWSPOST_QUERY = gql`
    query newspost($id: ID) {
        newspost(id: $id) {
            id
            title
            content
            owner {
                id
                firstName
                lastName
                profile {
                    avatarUrl
                }
            }
            created
        }
    }
`

const parseNewspostPayload = data => {
  if (!data || !data.newspost) {
    return null
  }

  return data.newspost
}

const useNewspostById = id => {
  const { loading, error, data } = useQuery(NEWSPOST_QUERY, {
    variables: { id },
  })
  const newspost = parseNewspostPayload(data)
  return { loading, error, newspost }
}

export { useNewspostById }
