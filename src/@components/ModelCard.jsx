import React, { useState } from 'react';
import { UserInline } from './UserInline';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { thumbnailActivityCountText } from '@style/text';
import { ModelThumbnail } from '@components/ModelThumbnail';
import { isError, isProcessing } from '@utilities';

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

const ActivityIndicators = styled.div`
    display: flex;
    flex-direction: row;
    > span:not(:last-child) {
        margin-right: 16px;
    }
`;

const ActivityCount = styled.span`
    ${thumbnailActivityCountText};
    display: flex;
    align-items: center;
    letter-spacing: 0px;
`;

const HeartIconStyled = styled(HeartIcon)`
    fill: ${props => props.theme.cardHeartColor};
`;

function CardContents({ className, model, showOwner, hovered }) {
    return (
        <CardContainer className={className}>
            <ModelThumbnail
                model={model}
                thumbnailUrl={model.attachment && model.attachment.imgSrc}
                showOwner={showOwner}
                hovered={hovered}
            ></ModelThumbnail>
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
    );
}

function ModelCard({ className, model, withOwner }) {
    const showOwner = withOwner && model.owner;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    if (isError(model) || isProcessing(model)) {
        return (
            <CardContents
                className={className}
                model={model}
                showOwner={showOwner}
                hovered={hovered}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
            />
        );
    }

    return (
        <Link
            to={`/model/${model.id}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
        >
            <CardContents
                className={className}
                model={model}
                showOwner={showOwner}
                hovered={hovered}
            />
        </Link>
    );
}

export { ModelCard };
