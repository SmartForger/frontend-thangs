import styled, { ThemeProvider, css } from 'styled-components';
import React, { useContext } from 'react';
import { NewTheme, NewDarkTheme } from '@style/ThangsNormal.theme.js';
import { GlobalStyle } from '@style/Thangs.GlobalStyle';
import { Header } from '@components/Header';
import { Flash, FlashContext, FlashContextProvider } from '@components/Flash';
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg';
import { landingPageText, landingPageSubtext } from '@style/text';
import { mediaMdPlus } from '@style/media-queries';

const allowCssProp = props => (props.css ? props.css : '');

const Padding = css`
    padding: ${props =>
            props.variant === 'small-vertical-spacing' ? '110px' : '195px'}
        16px 32px;

    ${mediaMdPlus} {
        padding: ${props =>
                props.variant === 'small-vertical-spacing' ? '110px' : '195px'}
            100px 32px;
    }
`;

const NewLayout = styled.div`
    ${Padding};
    margin: auto;
    max-width: ${props => props.theme.maxWidth};

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
    height: 756px;
    position: relative;
    display: flex;
    align-items: center;
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
