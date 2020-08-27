import { authenticationService } from '@services'

const useCurrentUserId = () => authenticationService.getCurrentUserId()

export default useCurrentUserId
