import * as R from 'ramda'
import { authenticationService } from '@services'
import useFetchOnce from './useServices/useFetchOnce'

const useCurrentUserStoreOn = () => {
  const id = authenticationService.getCurrentUserId()
  const props = useFetchOnce(id, 'user')

  if (R.isNil(id)) {
    return {
      dispatch: props.dispatch,
      atom: { isLoading: false, isError: true, isLoaded: true },
    }
  } else {
    return props
  }
}

export default useCurrentUserStoreOn
