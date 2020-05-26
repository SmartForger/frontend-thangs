import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { createMockClient } from 'mock-apollo-client';
import * as M from 'mock-apollo-client';
import { action } from '@storybook/addon-actions';

export const withApolloProvider = ({ requestMockHandlers }) => {
    const mockClient = createMockClient();
    requestMockHandlers.mutations.forEach(({ type, data }) => {
        mockClient.setRequestHandler(type, variables => {
            const name = type.definitions[0].name.value;
            action(`triggering mutation ${name}`)(variables);
            if (typeof data === 'function') {
                return Promise.resolve({ data: data(variables) });
            }
            return Promise.resolve({ data });
        });
    });
    requestMockHandlers.queries.forEach(({ type, data }) => {
        mockClient.setRequestHandler(type, variables => {
            const name = type.definitions[0].name.value;
            action(`triggering query ${name}`)(variables);
            if (typeof data === 'function') {
                return Promise.resolve({ data: data(variables) });
            }
            return Promise.resolve({ data });
        });
    });
    return storyFn => {
        return <ApolloProvider client={mockClient}>{storyFn()}</ApolloProvider>;
    };
};
