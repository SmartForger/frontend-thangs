import styled, { ThemeProvider } from 'styled-components';
import React, { useContext } from 'react';
import { NewTheme, NewDarkTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle } from '@style/Thangs.GlobalStyle';
import { Header } from '@components/Header';
import { Flash, FlashContext, FlashContextProvider } from '@components/Flash';
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg';

const allowCssProp = props => (props.css ? props.css : '');

const NewLayout = styled.div`
    padding: ${props =>
            props.variant === 'small-vertical-spacing' ? '96px' : '256px'}
        16px;
    margin: auto;
    max-width: 1237px;

    ${allowCssProp};
`;

function WithFlash({ children }) {
    const [flash] = useContext(FlashContext);
    return (
        <>
            {flash && <Flash>{flash}</Flash>}
            {children}
        </>
    );
}

export const WithNewThemeLayout = (Component, options = {}) => props => {
    const { logoOnly } = options;
    const headerVariant = logoOnly && 'logo-only';
    const layoutVariant = logoOnly && 'small-vertical-spacing';

    return (
        <FlashContextProvider>
            <ThemeProvider theme={NewTheme}>
                <GlobalStyle />
                <Header variant={headerVariant} />
                <NewLayout variant={layoutVariant}>
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
    font-weight: 300;
`;

const Background = styled(BackgroundSvg)`
    position: absolute;
    bottom: 0;
    right: 0;
`;

export const WithNewInvertedHeaderLayout = Component => props => {
    return (
        <FlashContextProvider>
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
                    <WithFlash>
                        <Component {...props} />
                    </WithFlash>
                </NewLayout>
            </ThemeProvider>
        </FlashContextProvider>
    );
};

export const WithNewSignupThemeLayout = Component => props => {
    return (
        <FlashContextProvider>
            <ThemeProvider theme={NewDarkTheme}>
                <GlobalStyle />
                <Header variant="logo-only" />
                <NewLayout variant="small-vertical-spacing">
                    <WithFlash>
                        <Component {...props} />
                    </WithFlash>
                </NewLayout>
            </ThemeProvider>
        </FlashContextProvider>
    );
};
