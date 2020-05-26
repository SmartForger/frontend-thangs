import React from 'react';
import styled from 'styled-components';
import ErrorImg from '@svg/image-error-icon.svg';
import { thumbnailErrorText, modelCardHoverText } from '@style/text';

const Overlay = styled.div`
    z-index: 1;
    position: absolute;
    text-align: center;
    height: 86px;
    width: 100%;
    background: linear-gradient(
        -180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.2) 100%
    );
    bottom: 0;
    left: 8px;
    display: flex;
    align-items: flex-end;
    margin: -8px -8px 0;
`;

const ModelName = styled.div`
    ${modelCardHoverText};
    margin: 16px;
`;

const ThumbnailContainer = styled.div`
    ${thumbnailErrorText};
    position: relative;
    height: 100%;
    overflow: hidden;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > img {
        margin: auto;
        display: block;
        max-width: calc(100% - 24px);
        height: auto;

        :before {
            content: ' ';
            display: block;
            background-color: ${props => props.theme.cardBackground};
            background-image: url(${ErrorImg});
            background-repeat: no-repeat;
            background-position: center 37%;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }

        :after {
            content: 'Image Error';
            position: absolute;
            display: block;
            top: 72.5%;
            left: 50%;
            transform: translateX(-50%);
        }
    }
`;

export function ModelThumbnail({
    name,
    thumbnailUrl: src,
    showOwner,
    hovered,
    className,
}) {
    return (
        <ThumbnailContainer showOwner={showOwner} className={className}>
            {src && <img src={src} alt={name} />}
            {hovered ? (
                <Overlay>
                    <ModelName>{name}</ModelName>
                </Overlay>
            ) : null}
        </ThumbnailContainer>
    );
}
