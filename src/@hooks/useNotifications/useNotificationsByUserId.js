import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'

const graphqlService = GraphqlService.getInstance()

const useNotificationsByUserId = () => {
  const id = authenticationService.getCurrentUserId()
  if (!id) {
    return { loading: false, error: undefined, notifications: [] }
  }
  const { loading, error, notifications } = graphqlService.useNotificationsByUserId(id)
  return { loading, error, notifications }
}

export default useNotificationsByUserId
