import React from 'react';
import styled from 'styled-components';
import rightStripes from '@images/Thangs_Stripes_Right.png';
import lefttStripes from '@images/Thangs_Stripes_Left.png';

const ChildStyle = styled.img`
    margin: 0 3vh;
`;

const StyledBackground = styled.div`
    width: 100vw;
    position: absolute;
    display: flex;
    justify-content: space-between;
    background: ${props => props.theme.primary};
    z-index: -2;
    height: 100%;
    overflow: hidden;
`;

const BackgroundImage = () => (
    <StyledBackground>
        <ChildStyle src={lefttStripes} />
        <ChildStyle src={rightStripes} />
    </StyledBackground>
);

export { BackgroundImage };
