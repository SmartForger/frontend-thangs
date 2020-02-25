import { authenticationService } from '@services';

const handleResponse = async response => {
    console.log(response);
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        console.log(response.status);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                console.log(response.status);
                //auto logout if a 401 or 403 is recieved
                authenticationService.logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
};

export { handleResponse };
