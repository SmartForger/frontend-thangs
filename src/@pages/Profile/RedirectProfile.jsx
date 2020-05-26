import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '@services';

export function RedirectProfile() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return <Redirect to={`/login`} />;
    }
    return <Redirect to={`/profile/${id}`} />;
}
