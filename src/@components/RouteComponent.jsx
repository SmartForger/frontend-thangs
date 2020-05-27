import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '@services';
import { history } from '../history';

export function routeRequiresAuth(Component, redirectDest = '/login') {
    return function AuthRouteComponent(...props) {
        const isAuthed = authenticationService.getCurrentUserId() !== undefined;
        const currentPath = history.location.pathname;
        const shouldRedirect = !isAuthed && currentPath !== redirectDest;
        console.debug(
            `Route requires authenticated user, should redirect to ${redirectDest}? ${shouldRedirect}`
        );
        return shouldRedirect ? (
            <Redirect to={redirectDest} />
        ) : (
            <Component {...props} />
        );
    };
}

export function routeRequiresAnon(Component, redirectDest = '/') {
    return function AnonymousRouteComponent(...props) {
        const isAuthed = authenticationService.getCurrentUserId() !== undefined;
        const currentPath = history.location.pathname;
        const shouldRedirect = isAuthed && currentPath !== redirectDest;
        console.debug(
            `Route requires anonymous user, should redirect to ${redirectDest}? ${shouldRedirect}`
        );
        return shouldRedirect ? (
            <Redirect to={redirectDest} />
        ) : (
            <Component {...props} />
        );
    };
}
