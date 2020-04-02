import styled, { css, ThemeProvider } from 'styled-components';
import React, { useContext } from 'react';
import { ThangsHeader } from '@components/ThangsHeader';
import { ThangsMain, NewTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle, NewGlobalStyle } from '@style/Thangs.GlobalStyle';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { Flash, FlashContext, FlashContextProvider } from '@components/Flash';

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

function WithFlash({ children }) {
    const [state] = useContext(FlashContext);
    return (
        <>
            {state.flash && <Flash>{state.flash}</Flash>}
            {children}
        </>
    );
}

const WithNewThemeLayout = Component => props => {
    return (
        <FlashContextProvider>
            <ThemeProvider theme={NewTheme}>
                <NewGlobalStyle />
                <Header />
                <NewLayout>
                    <WithFlash>
                        <Component {...props} />
                    </WithFlash>
                </NewLayout>
            </ThemeProvider>
        </FlashContextProvider>
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
