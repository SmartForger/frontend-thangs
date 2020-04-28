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
import {
    thumbnailErrorText,
    modelCardHoverText,
    thumbnailActivityCountText,
} from '@style/text';
import { BLACK_2 } from '@style/colors';
import { ProgressText } from '@components/ProgressText';

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
    ${thumbnailErrorText};
    position: relative;
    border-radius: 8px 8px 0px 0px;
    height: 100%;
    min-height: 205px;
    overflow: hidden;
    padding: 8px 8px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > img {
        margin: auto;
        display: block;
        max-width: calc(100% - 80px);
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

const PlaceholderText = styled.div`
    margin-top: 24px;
    text-align: center;
`;

const isProcessing = R.propEq('uploadStatus', 'PROCESSING');
const isError = R.propEq('uploadStatus', 'ERROR');

const StatusOverlay = styled.div`
    position: absolute;
    background-color: ${BLACK_2};
    opacity: 0.85;
    top: -8px;
    padding-top: 8px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

function ModelThumbnail({ model, thumbnailUrl: src, children, showOwner }) {
    return (
        <ThumbnailContainer showOwner={showOwner}>
            {isError(model) || !src ? (
                <StatusOverlay>
                    <ErrorIcon />
                    <PlaceholderText>
                        <div>Error Procesing.</div>
                        <div>Try uploading model again.</div>
                    </PlaceholderText>
                </StatusOverlay>
            ) : (
                <>
                    {src && <img src={src} alt={model.name} />}
                    {isProcessing(model) && (
                        <StatusOverlay>
                            <LoadingIcon />
                            <PlaceholderText>
                                <ProgressText
                                    text="Processing for matches"
                                    css={`
                                        width: 177px;
                                    `}
                                />
                            </PlaceholderText>
                        </StatusOverlay>
                    )}
                </>
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
    ${modelCardHoverText};
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
    ${thumbnailActivityCountText};
    display: flex;
    align-items: center;
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
        </Link>
    );
}

export { ModelCard };
