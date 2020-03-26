import React from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import { Link } from 'react-router-dom';

const ModelDisplayStyled = styled(animated.div)`
    width: 185px;
    height: 135px;
    background: ${props => props.imgURL || props.theme.white};
    margin: 10px;
    border-radius: 2%;
    text-align: center;
    box-shadow: inset 0 0 0 3px black;
`;

const LinkBox = styled(animated(Link))`
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
        transform: scale(0.9);
    }
`;

const ModelName = styled.div`
    text-align: center;
`;

const ModelDisplay = ({
    model,
    style, // This prop is used to attach react-spring animations
}) => {
    return (
        <LinkBox
            to={`/model/${model.id}`}
            style={style}
            data-cy="profile-model-link"
        >
            <ModelDisplayStyled />
            <ModelName>{model.name}</ModelName>
        </LinkBox>
    );
};

export { ModelDisplay };
