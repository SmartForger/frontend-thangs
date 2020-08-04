import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'
import { useStoreon } from 'storeon/react'

const graphqlService = GraphqlService.getInstance()

export function useCurrentUser() {
  const id = authenticationService.getCurrentUserId()
  const { user: userStore } = useStoreon('user')
  if (!id) {
    return { loading: false, error: undefined, user: undefined }
  }

  const { loading, error, user } = graphqlService.useUserById(id)
  if (user) user.models = [...userStore.models, ...user.models] //TEMP - This is to merge the user models cached by graphQL and new models uploaded as new versions - BE
  return { loading, error, user }
}
