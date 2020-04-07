import React from 'react';
import styled from 'styled-components';

const StyleCard = styled.div`
    border-radius: 4px;
    box-shadow: ${props =>
        props.shadow ? 'rgba(0,0,0,0.8) 0 0 10px' : 'black 0 0 0'};
    border: ${props => (props.bordered ? '2px solid black' : 'none')};
    background: ${props => props.theme.white};
    margin: ${props => props.margin || '5px'};
`;

const StyleCardHead = styled.div`
    color: ${props => props.headerColor || props.theme.secondary};
    font-size: ${props => props.fontSize || 1}rem;
    padding: 0 5%;
    margin-bottom: 12px;
    text-align: center;
`;

const StyleCardBody = styled.div`
    color: ${props => props.bodyColor || props.theme.secondary};
`;

const DisplayCard = props => {
    const { children, headerContent } = props;
    return (
        <StyleCard {...props}>
            <StyleCardHead {...props}>
                {headerContent ? headerContent : null}
            </StyleCardHead>
            <StyleCardBody {...props}>
                {children ? children : null}
            </StyleCardBody>
        </StyleCard>
    );
};

export { DisplayCard };
