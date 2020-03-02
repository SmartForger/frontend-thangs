import { authenticationService } from '../@services';

const authHeader = () => {
    const currentUser = authenticationService.currentUser;
    if (currentUser && currentUser.accessToken) {
        return { Authorization: `Bearer ${currentUser.accessToken}` };
    } else {
        return {};
    }
};

export { authHeader };
