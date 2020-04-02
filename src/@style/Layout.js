import styled, { css, ThemeProvider } from 'styled-components';
import React from 'react';
import { ThangsHeader } from '@components/ThangsHeader';
import { ThangsMain, NewTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle, NewGlobalStyle } from '@style/Thangs.GlobalStyle';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';

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

const NewLayout = styled.div`
    margin: 236px auto 0;
    max-width: 1237px;
    padding: 0 16px;
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
            <Footer />
        </ThemeProvider>
    );
};

const WithNewThemeLayout = Component => props => {
    return (
        <ThemeProvider theme={NewTheme}>
            <NewGlobalStyle />
            <Header />
            <NewLayout>
                <Component {...props} />
            </NewLayout>
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
            <Footer />
        </ThemeProvider>
    );
};
export { WithLayout, WithFullScreenLayout, WithNewThemeLayout };
