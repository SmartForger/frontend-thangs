import { authenticationService } from '@services'
import useFetchOnce from './useServices/useFetchOnce'

const useCurrentUserStoreOn = () => {
  const id = authenticationService.getCurrentUserId()
  const props = useFetchOnce(id, 'user')

  return props
}

export default useCurrentUserStoreOn
