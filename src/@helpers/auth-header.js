import { authenticationService } from '@services';

const authHeader = () => {
  const currentUser = authenticationService.currentUser;
  if (currentUser && currentUser.token) {
    return {Authorization: `Bearer ${currentUser.token}`};
  } else {
    return {};
  }
}

export {authHeader};