import { authenticationService } from '@services'
import apiForChain from './apiForChain'

export default props =>
  apiForChain(props)
    .catch(e => {
      if (e && e.response && e.response.status === 403) {
        authenticationService.logout()
        window.location.href = '/login?sessionExpired=true'
      }
      return Promise.resolve({ data: {}, error: e })
    })
