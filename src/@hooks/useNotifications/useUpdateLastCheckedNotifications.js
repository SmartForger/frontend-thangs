import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'

const noop = () => undefined

const graphqlService = GraphqlService.getInstance()

const useUpdateLastCheckedNotifications = () => {
  const id = authenticationService.getCurrentUserId()
  if (!id) {
    const updateLastChecked = noop
    return [updateLastChecked, { loading: false, error: undefined, data: undefined }]
  }

  const [
    updateLastChecked,
    { loading, error, data },
  ] = graphqlService.useUpdateLastCheckedNotificationsForUser(id)

  return [updateLastChecked, { loading, error, data }]
}

export default useUpdateLastCheckedNotifications
