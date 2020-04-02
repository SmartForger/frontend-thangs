import React from 'react';
import { UserInline } from './UserInline';
import styled from 'styled-components';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;

    background: ${props => props.theme.cardBackground};
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    width: 297px;
`;

const CardContent = styled.div`
    padding: 8px 16px;
`;

const ThumbnailContainer = styled.div`
    background: ${props => props.theme.modelThumbnailPlaceholder};
    border-radius: 8px 8px 0px 0px;
    height: 196px;
    > img {
        width: 100%;
        height: 100%;
    }
`;

function ModelThumbnail(props) {
    const model = props.model;
    const src = model.thumbnailUrl;
    return (
        <ThumbnailContainer>
            {src && <img src={src} alt={model.name} />}
        </ThumbnailContainer>
    );
}

const ModelName = styled.div`
    text-align: center;
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
    return (
        <CardContainer className={className}>
            <ModelThumbnail model={model} />
            <CardContent>
                <ModelName>{model.name}</ModelName>
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
    );
}

export { ModelCard };
