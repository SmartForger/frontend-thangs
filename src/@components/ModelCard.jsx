import React, { useState } from 'react';
import { UserInline } from './UserInline';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';

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
    background: ${props => props.theme.modelThumbnailPlaceholder};
    border-radius: 8px 8px 0px 0px;
    height: 100%;
    > img {
        width: 100%;
        height: 100%;
    }
`;

function ModelThumbnail({ model, thumbnailUrl: src, children }) {
    return (
        <ThumbnailContainer>
            {src && <img src={src} alt={model.name} />}
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
    display: flex;
    align-items: flex-end;
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
    font-family: HelveticaNeueLTStd-Md;
    font-size: 14px;
    font-weight: md;
    letter-spacing: 0px;
`;

const HeartIconStyled = styled(HeartIcon)`
    fill: ${props => props.theme.cardHeartColor};
`;

function ModelCard({ className, model, withOwner }) {
    const showOwner = withOwner && model.owner;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    return (
        <Link
            to={`/new/preview/model/${model.id}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
        >
            <CardContainer className={className}>
                <ModelThumbnail model={model}>
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
        </Link>
    );
}

export { ModelCard };
