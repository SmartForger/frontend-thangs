import styled, { css, ThemeProvider } from 'styled-components';
import React from 'react';
import { ThangsHeader } from '@components/ThangsHeader';
import { ThangsMain, NewTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle } from '@style/Thangs.GlobalStyle';

const frame = fullScreen => {
    return fullScreen
        ? css`
              padding-right: 32px;
              padding-left: 32px;
          `
        : css`
              max-width: ${props => props.theme.pageWidth};
          `;
};

const Layout = styled.div`
    ${props => frame(props.fullScreen)};
    margin: ${props => props.theme.headerHeight} auto 0;
`;

const Content = styled.div`
    width: 100%;
    padding-top: 15px;
`;

const WithLayout = Component => props => {
    return (
        <ThemeProvider theme={ThangsMain}>
            <GlobalStyle />
            <ThangsHeader />
            <Layout>
                <Content>
                    <Component {...props} />
                </Content>
            </Layout>
        </ThemeProvider>
    );
};

const WithNewThemeLayout = Component => props => {
    return (
        <ThemeProvider theme={NewTheme}>
            <Component {...props} />
        </ThemeProvider>
    );
};

const WithFullScreenLayout = Component => props => {
    return (
        <ThemeProvider theme={ThangsMain}>
            <GlobalStyle />
            <ThangsHeader />
            <Layout fullScreen>
                <Content>
                    <Component {...props} />
                </Content>
            </Layout>
        </ThemeProvider>
    );
};
export { WithLayout, WithFullScreenLayout, WithNewThemeLayout };
