import React, { useState } from 'react';
import { UserInline } from '../UserInline';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { thumbnailActivityCountText, regularText } from '@style/text';
import { ModelThumbnail } from '@components/ModelThumbnail';
import { Card } from '@components/Card';
import { BLUE_2 } from '../../@style/colors';

const Content = styled.div`
    padding: 8px 16px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
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

const HeartIconStyled = styled(HeartIcon)``;
const ChatIconStyled = styled(ChatIcon)``;

const ModelThumbnailStyled = styled(ModelThumbnail)`
    padding-bottom: 0;
    min-height: 196px;
    margin: auto;
    max-width: calc(100% - 118px);
    width: 100%;
    border-radius: 8px 8px 0px 0px;
`;

const Name = styled.div`
    ${regularText};
`;

function CardContents({ className, model, showOwner, hovered }) {
    return (
        <Card className={className}>
            <ModelThumbnailStyled
                name={model.name}
                thumbnailUrl={model.thumbnailUrl}
                showOwner={showOwner}
            ></ModelThumbnailStyled>
            <Content>
                <Name>{model.name}</Name>
                <Row
                    css={`
                        margin-top: 8px;
                    `}
                >
                    {showOwner && <UserInline user={model.owner} />}
                    <ActivityIndicators>
                        <ActivityCount>
                            <ChatIconStyled
                                css={`
                                    fill: ${BLUE_2};
                                `}
                            />
                            &nbsp;{model.commentsCount}
                        </ActivityCount>
                        <ActivityCount>
                            <HeartIconStyled
                                css={`
                                    fill: ${BLUE_2};
                                `}
                            />
                            &nbsp;{model.likesCount}
                        </ActivityCount>
                    </ActivityIndicators>
                </Row>
            </Content>
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
