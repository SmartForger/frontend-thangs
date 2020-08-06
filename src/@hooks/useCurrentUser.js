import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'

const graphqlService = GraphqlService.getInstance()

const useCurrentUser = () => {
  const id = authenticationService.getCurrentUserId()
  if (!id) {
    return { loading: false, error: undefined, user: undefined }
  }

  const { loading, error, user } = graphqlService.useUserById(id)
  return { loading, error, user }
}

export default useCurrentUser
