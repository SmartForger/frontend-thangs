import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '@services';

export function RedirectProfile() {
    const id = authenticationService.getCurrentUserId();
    return <Redirect to={`/profile/${id}`} />;
}
