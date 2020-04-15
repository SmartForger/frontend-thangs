import React, { useState } from 'react';
import { UserInline } from './UserInline';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import styled from 'styled-components';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import ErrorImg, {
    ReactComponent as ErrorIcon,
} from '@svg/image-error-icon.svg';
import { ReactComponent as LoadingIcon } from '@svg/image-loading-icon.svg';

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;

    background: ${props => props.theme.cardBackground};
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    height: 100%;
`;

const CardContent = styled.div`
    padding: 8px 16px;
`;

const ThumbnailContainer = styled.div`
    position: relative;
    border-radius: 8px 8px 0px 0px;
    height: 100%;
    max-height: calc(100% - ${props => (props.showOwner ? '80px' : '40px')});
    overflow: hidden;
    padding: 8px 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
        margin: auto;
        display: block;
        height: 100%;

        :before {
            content: ' ';
            display: block;
            background-color: ${props => props.theme.cardBackground};
            background-image: url(${ErrorImg});
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
    }
`;

const isProcessing = R.propEq('uploadStatus', 'processing');
const isError = R.propEq('uploadStatus', 'error');

function ModelThumbnail({ model, thumbnailUrl: src, children, showOwner }) {
    return (
        <ThumbnailContainer showOwner={showOwner} isError={isError(model)}>
            {isProcessing(model) ? (
                <LoadingIcon />
            ) : isError(model) || !src ? (
                <ErrorIcon />
            ) : (
                <img src={src} alt={model.name} />
            )}
            {children}
        </ThumbnailContainer>
    );
}

const Overlay = styled.div`
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
    color: ${props => props.theme.modelActionButtonText};
    font-weight: 500;
    margin: 16px;
`;

const ActivityIndicators = styled.div`
    display: flex;
    flex-direction: row;
    > span:not(:last-child) {
        margin-right: 16px;
    }
`;

const ActivityCount = styled.span`
    display: flex;
    align-items: center;

    color: ${props => props.theme.activityCount};
    font-weight: 500;
    letter-spacing: 0px;
`;

const HeartIconStyled = styled(HeartIcon)`
    fill: ${props => props.theme.cardHeartColor};
`;

const LinkStyled = styled(Link)`
    color: inherit;
`;

function ModelCard({ className, model, withOwner }) {
    const showOwner = withOwner && model.owner;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    return (
        <LinkStyled
            to={`/model/${model.id}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
        >
            <CardContainer className={className}>
                <ModelThumbnail
                    model={model}
                    thumbnailUrl={model.attachment && model.attachment.imgSrc}
                    showOwner={showOwner}
                >
                    {hovered ? (
                        <Overlay>
                            <ModelName>{model.name}</ModelName>
                        </Overlay>
                    ) : null}
                </ModelThumbnail>
                <CardContent>
                    {showOwner && <UserInline user={model.owner} />}
                    <ActivityIndicators>
                        <ActivityCount>
                            <ChatIcon />
                            &nbsp;{model.commentsCount}
                        </ActivityCount>
                        <ActivityCount>
                            <HeartIconStyled />
                            &nbsp;{model.likesCount}
                        </ActivityCount>
                    </ActivityIndicators>
                </CardContent>
            </CardContainer>
        </LinkStyled>
    );
}

export { ModelCard };
