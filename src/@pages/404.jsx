import React from 'react';
import { WithNewThemeLayout } from '@style/Layout';

export const Message404 = () => {
    return <h1>We couldn't find the page you're looking for. Sorry!</h1>;
};

export const Page404 = WithNewThemeLayout(Message404);
