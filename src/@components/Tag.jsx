import React from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';

const TagStyled = styled(animated.div)`
    width: fit-content;
    background: ${props => props.theme.grey};
    color: ${props => props.theme.secondary};
    margin: 2px;
    padding: 4px;
    user-select: none;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.2s all;

    &:hover {
        background: ${props => props.theme.secondary};
        color: ${props => props.theme.primary};
        transform: scale(1.05);
    }
`;

const Tag = ({ children }) => {
    return <TagStyled>{children}</TagStyled>;
};

export { Tag };
