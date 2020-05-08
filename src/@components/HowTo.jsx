import React from 'react';
import styled from 'styled-components';
import { TextButton } from '@components/Button';
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg';
import { ReactComponent as ColorIcon1 } from '@svg/icon-color-1.svg';
import { ReactComponent as ColorIcon2 } from '@svg/icon-color-2.svg';
import { ReactComponent as ShadedIcon } from '@svg/icon-shaded.svg';
import { ReactComponent as CompositeIcon } from '@svg/icon-composite.svg';
import { ReactComponent as WireframeIcon } from '@svg/icon-wireframe.svg';
import { howToTitle } from '@style/text';
import { BLACK_5 } from '@style/colors';

const TextStyled = styled.div`
    max-width: 474px;
    color: ${props => props.theme.viewerText};
    margin-bottom: 72px;
`;

function Text() {
    return (
        <TextStyled>
            Model can be viewed as Wireframe, Shaded or Composite and changed
            via the icons in the viewer. Wireframe color and shading color can
            be changed using the paint icons in the viewer. Model can be zoomed
            in and out and rotated 360 degrees.
        </TextStyled>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const TitleStyled = styled.h4`
    ${howToTitle};
    margin-bottom: 24px;
`;

function Title() {
    return <TitleStyled>How to Use:</TitleStyled>;
}

const IconSpacing = styled.div`
    margin-left: 48px;
`;

const IconContainer = styled.div`
    display: flex;

    svg + svg {
        margin-left: 24px;
    }
`;

function Icons() {
    return (
        <IconContainer>
            <div>
                <ShadedIcon />
                <WireframeIcon />
                <CompositeIcon />
            </div>

            <IconSpacing>
                <ColorIcon1 />
                <ColorIcon2 />
            </IconSpacing>
        </IconContainer>
    );
}

const ExitIconStyled = styled.div`
    position: absolute;
    right: 32px;
    top: 32px;

    svg {
        fill: ${BLACK_5};
        stroke: ${BLACK_5};
    }
`;

const Frame = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    cursor: pointer;
`;

export function HowTo({ setSeenHowTo }) {
    const handleClick = () => setSeenHowTo(true);
    return (
        <Frame onClick={handleClick}>
            <TextButton>
                <ExitIconStyled>
                    <ExitIcon />
                </ExitIconStyled>
            </TextButton>
            <Container>
                <Title />
                <Text />
                <Icons />
            </Container>
        </Frame>
    );
}
