import React from 'react';
import { ProfilePicture } from './ProfilePicture';
import styled from 'styled-components';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;

    background: rgb(255, 255, 255);
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    /* height: 297px; */
    width: 297px;
`;

const ThumbnailContainer = styled.div`
    background: rgb(245, 245, 245);
    border-radius: 8px 8px 0px 0px;
    height: 196px;
    width: 297px;
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
            <img src={src} alt={model.name} />
        </ThumbnailContainer>
    );
}

const ModelName = styled.div`
    margin: 8px 16px;
    text-align: center;
`;

const InlineUserContainer = styled.div`
    margin: 8px 16px;
`;

function InlineUser(props) {
    const user = props.user;
    return (
        <InlineUserContainer>
            <ProfilePicture size="24px" user={user} />
            &nbsp;
            <span>{user.fullName}</span>
        </InlineUserContainer>
    );
}

const ActivityIndicators = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActivityCount = styled.span`
    display: flex;
    align-items: center;

    color: rgb(155, 155, 155);
    font-family: HelveticaNeueLTStd-Md;
    font-size: 14px;
    font-weight: md;
    letter-spacing: 0px;
    margin: 8px 16px;
`;

function ModelCard({ className, model, withOwner }) {
    const showOwner = withOwner && model.owner;
    return (
        <CardContainer className={className}>
            <ModelThumbnail model={model} />
            <ModelName>{model.name}</ModelName>
            {showOwner && <InlineUser user={model.owner} />}
            <ActivityIndicators>
                <ActivityCount>
                    <ChatIcon />
                    &nbsp;{model.numComments || 0}
                </ActivityCount>
                <ActivityCount>
                    <HeartIcon />
                    &nbsp;{model.numLikes || 0}
                </ActivityCount>
            </ActivityIndicators>
        </CardContainer>
    );
}

export { ModelCard };
