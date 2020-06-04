import styled, { ThemeProvider, css } from 'styled-components/macro';
import React from 'react';
import { NewTheme, NewDarkTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle } from '@style/Thangs.GlobalStyle';
import { Header } from '@components/Header';
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg';
import { landingPageText, landingPageSubtext } from '@style/text';
import { mediaMdPlus } from '@style/media-queries';

const Padding = css`
    padding-top: ${114 + 8}px;
    padding-right: 16px;
    padding-bottom: 32px;
    padding-left: 16px;

    ${mediaMdPlus} {
        padding-right: 100px;
        padding-left: 100px;
    }
`;

const NewLayout = styled.div`
    ${Padding};
    margin: auto;
    max-width: ${props => props.theme.maxWidth};
`;

export const WithNewThemeLayout = (Component, options = {}) => props => {
    const { logoOnly } = options;
    const headerVariant = logoOnly && 'logo-only';
    const layoutVariant = logoOnly && 'small-vertical-spacing';

    return (
        <ThemeProvider theme={NewTheme}>
            <GlobalStyle />
            <Header variant={headerVariant} />
            <NewLayout variant={layoutVariant}>
                <Component {...props} />
            </NewLayout>
        </ThemeProvider>
    );
};

const Hero = styled.div`
    background: ${props => props.theme.invertedHeaderBackground};
    height: 756px;
    position: relative;
    display: flex;
    justify-content: center;
    padding: 0;
`;

const PromotionalText = styled.div`
    font-family: ${props => props.theme.headerFont};

    * {
        ${landingPageText};
    }
`;

const TextContainer = styled.div`
    margin: auto 16px;
    ${mediaMdPlus} {
        margin: auto 100px;
    }
    max-width: ${props => props.theme.maxWidth}
    width: 100%;
`;

const PromotionalSecondaryText = styled.div`
    ${landingPageSubtext};
    max-width: 550px;
    margin-top: 24px;
`;

const Background = styled(BackgroundSvg)`
    position: absolute;
    bottom: 0;
    right: 0;
`;

export const WithNewInvertedHeaderLayout = Component => props => {
    return (
        <ThemeProvider theme={NewTheme}>
            <GlobalStyle />
            <Header inverted />
            <Hero>
                <Background />
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
            <NewLayout variant="small-vertical-spacing">
                <Component {...props} />
            </NewLayout>
        </ThemeProvider>
    );
};

export const WithNewSignupThemeLayout = Component => props => {
    return (
        <ThemeProvider theme={NewDarkTheme}>
            <GlobalStyle />
            <Header variant="logo-only" />
            <NewLayout variant="small-vertical-spacing">
                <Component {...props} />
            </NewLayout>
        </ThemeProvider>
    );
};
