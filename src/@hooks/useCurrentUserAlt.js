import { authenticationService } from '@services'

const useCurrentUserAlt = userId => {
  const currentUserId = authenticationService.getCurrentUserId()

  return `${userId}` === `${currentUserId}`
}

export default useCurrentUserAlt
