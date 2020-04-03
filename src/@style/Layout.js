import styled, { css, ThemeProvider } from 'styled-components';
import React, { useContext } from 'react';
import { ThangsHeader } from '@components/ThangsHeader';
import { ThangsMain, NewTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle, NewGlobalStyle } from '@style/Thangs.GlobalStyle';
import { Footer } from '@components/Footer';
import { Header, InvertedHeaderBackground } from '@components/Header';
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

const allowCssProp = props => (props.css ? props.css : '');

const NewLayout = styled.div`
    margin: 256px auto 0;
    max-width: 1237px;
    padding: 0 16px;

    ${allowCssProp};
`;

const Content = styled.div`
    width: 100%;
    padding-top: 15px;
`;

export const WithLayout = Component => props => {
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
    const [flash] = useContext(FlashContext);
    return (
        <>
            {flash && <Flash>{flash}</Flash>}
            {children}
        </>
    );
}

export const WithNewThemeLayout = Component => props => {
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

const Hero = styled.div`
    background: ${props => props.theme.invertedHeaderBackground};
    width: 100%;
    height: 756px;
    position: relative;
    display: flex;
    align-items: center;
`;

const PromotionalText = styled.div`
    margin: 0 16px;

    * {
        color: ${props => props.theme.promotionalTextColor};
        text-decoration-color: ${props => props.theme.brandColor};
        font-size: 72px;
    }
`;

const TextContainer = styled.div`
    margin: auto;
    max-width: 1237px;
    width: 100%;
`;

const PromotionalSecondaryText = styled.div`
    margin: 0 16px;
    max-width: 550px;

    color: ${props => props.theme.promotionalSecondaryTextColor};
    font-size: 32px;
    font-family: Montserrat-Light;
    font-weight: 300;
`;

export const WithNewInvertedHeaderLayout = Component => props => {
    return (
        <FlashContextProvider>
            <ThemeProvider theme={NewTheme}>
                <NewGlobalStyle />
                <Header inverted />
                <Hero>
                    <TextContainer>
                        <PromotionalText>
                            <span>
                                <u>Build</u> Thangs.
                            </span>
                        </PromotionalText>
                        <PromotionalSecondaryText>
                            3D model community for designers, engineers and
                            enthusiasts
                        </PromotionalSecondaryText>
                    </TextContainer>
                </Hero>
                <NewLayout
                    css={`
                        margin-top: 24px;
                    `}
                >
                    <WithFlash>
                        <Component {...props} />
                    </WithFlash>
                </NewLayout>
            </ThemeProvider>
        </FlashContextProvider>
    );
};

export const WithFullScreenLayout = Component => props => {
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
