import React from 'react';
import styled, { ThemeProvider } from 'styled-components/macro';
import { addDecorator } from '@storybook/react';
import { GlobalStyle } from '@style/Thangs.GlobalStyle';
import { NewTheme } from '@style/ThangsNormal.theme.js';
import { ErrorBoundary } from '../src/ErrorBoundary';
import { AppFrame } from '../src/App';
import { logger } from '../src/logging';

const StoryFrame = styled.div`
    padding: 16px;
`;

addDecorator(storyFn => {
    return (
        <AppFrame>
            <ThemeProvider theme={NewTheme}>
                <GlobalStyle />
                <StoryFrame>{storyFn()}</StoryFrame>
            </ThemeProvider>
        </AppFrame>
    );
});
