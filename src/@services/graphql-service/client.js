import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createAuthenticatedFetch } from '@services/authenticated-fetch'

import { getGraphQLUrl } from './utils'

import { logger } from '../../logging'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

const cache = new InMemoryCache({ fragmentMatcher })

export const graphqlClient = (originalFetch, history) =>
  new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            logger.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          )
        if (networkError)
          logger.log(`[Network error]: ${networkError}`)
      }),
      createUploadLink({
        uri: getGraphQLUrl(),
        fetch: createAuthenticatedFetch(originalFetch, history),
        credentials: 'same-origin',
      }),
    ]),
    cache,
  })
