import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'

const graphqlService = GraphqlService.getInstance()

const useUnreadNotificationCount = () => {
  const id = authenticationService.getCurrentUserId()
  if (!id) {
    return {
      loading: false,
      error: undefined,
      unreadNotifications: undefined,
    }
  }

  const {
    loading,
    error,
    unreadNotificationCount,
  } = graphqlService.useUserUnreadNotificationCount(id)

  return { loading, error, unreadNotificationCount }
}

export default useUnreadNotificationCount
