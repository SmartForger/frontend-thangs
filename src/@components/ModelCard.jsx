import React, { useState } from 'react';
import { UserInline } from './UserInline';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { thumbnailActivityCountText } from '@style/text';
import { ModelThumbnail } from '@components/ModelThumbnail';
import { Card } from '@components/Card';

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

const ModelThumbnailStyled = styled(ModelThumbnail)`
    padding-bottom: 0;
    min-height: 205px;
    border-radius: 8px 8px 0px 0px;
`;

function CardContents({ className, model, showOwner, hovered }) {
    return (
        <Card className={className}>
            <ModelThumbnailStyled
                name={model.name}
                thumbnailUrl={model.thumbnailUrl}
                showOwner={showOwner}
                hovered={hovered}
            ></ModelThumbnailStyled>
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
        </Card>
    );
}

function ModelCard({ className, model, withOwner }) {
    const showOwner = withOwner && model.owner;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

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
