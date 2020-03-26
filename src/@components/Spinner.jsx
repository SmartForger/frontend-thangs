import React from 'react';
import styled from 'styled-components';

const StyledSpinner = styled.svg`
    animation: rotate 2s linear infinite;
    width: ${props => props.size || '50'}px;
    height: ${props => props.size || '50'}px;
    margin: auto;
    display: block;

    & .path {
        stroke: ${props => props.theme.secondary};
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes dash {
        0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
        }
    }
`;

const Spinner = props => (
    <StyledSpinner {...props} viewBox="0 0 50 50">
        <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
        />
    </StyledSpinner>
);

export { Spinner };
