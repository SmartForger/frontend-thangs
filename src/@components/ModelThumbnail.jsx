import React from 'react';
import styled, { css } from 'styled-components';
import { isError, isProcessing } from '@utilities';
import { ProgressText } from '@components/ProgressText';
import { TextButton } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { useCurrentUser } from '@customHooks/Users';
import ErrorImg from '@svg/image-error-icon.svg';
import { ReactComponent as LoadingIcon } from '@svg/image-loading-icon.svg';
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg';
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg';
import { BLACK_2, WHITE_3 } from '@style/colors';
import { thumbnailErrorText, modelCardHoverText } from '@style/text';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

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

const ErrorIconStyled = styled(ErrorIcon)`
    height: 65px;
`;

const SmallErrorIconStyled = styled(ErrorIcon)`
    width: 24px;
    height: 24px;
`;

const PlaceholderText = styled.div`
    margin-top: 24px;
    text-align: center;
`;

const StatusOverlay = css`
    background-color: ${BLACK_2};
    content: '';
    display: block;
    position: absolute;
    opacity: 0.85;
    top: -8px;
    padding-top: 8px;
    height: 100%;
    width: 100%;
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

    :after {
        ${props => props.showStatusOverlay && StatusOverlay};
    }

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

const StatusOverlayText = styled.div`
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
`;

const IconButton = styled(TextButton)`
    position: absolute;
    right: 8px;
    top: 8px;
    svg {
        fill: ${WHITE_3};
        stroke: ${WHITE_3};
        color: ${WHITE_3};
    }
`;

const SpinnerStyled = styled(Spinner)`
    height: 24px;
    width: 24px;
    & .path {
        stroke: currentColor;
    }
`;

function ErrorOverlay({ model }) {
    const { user } = useCurrentUser();
    const [
        deleteModel,
        { loading, error },
    ] = graphqlService.useDeleteModelMutation(model.id, user.id);

    const handleClick = e => {
        e.preventDefault();
        deleteModel();
    };

    return (
        <StatusOverlayText>
            <IconButton disabled={loading || error}>
                {loading ? (
                    <SpinnerStyled />
                ) : error ? (
                    <SmallErrorIconStyled />
                ) : (
                    <ExitIcon onClick={handleClick} />
                )}
            </IconButton>
            <ErrorIconStyled />
            <PlaceholderText>
                <div>Error Procesing.</div>
                <div>Try uploading model again.</div>
            </PlaceholderText>
        </StatusOverlayText>
    );
}

export function ModelThumbnail({
    model,
    thumbnailUrl: src,
    children,
    showOwner,
    hovered,
    showStatusOverlay,
}) {
    return (
        <ThumbnailContainer
            showOwner={showOwner}
            showStatusOverlay={showStatusOverlay}
        >
            {isError(model) || !src ? (
                <ErrorOverlay model={model} />
            ) : (
                <>
                    {src && <img src={src} alt={model.name} />}
                    {isProcessing(model) && (
                        <StatusOverlayText>
                            <LoadingIcon />
                            <PlaceholderText>
                                <ProgressText
                                    text="Processing for matches"
                                    css={`
                                        width: 177px;
                                    `}
                                />
                            </PlaceholderText>
                        </StatusOverlayText>
                    )}
                </>
            )}
            {hovered ? (
                <Overlay>
                    <ModelName>{model.name}</ModelName>
                </Overlay>
            ) : null}
        </ThumbnailContainer>
    );
}
