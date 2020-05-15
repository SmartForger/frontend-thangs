import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as DateFns from 'date-fns';
import { ProfilePicture } from '@components/ProfilePicture';
import { ModelThumbnail } from '@components/ModelThumbnail';
import { Card } from '@components/Card';
import { commentUsername } from '@style/text';
import { commentPostedText } from '@style/text';
import { isCompleted } from '@utilities';
import {
    isModelChangedStatus,
    isModelCompletedProcessing,
    isModelFailedProcessing,
    isUserCommentedOnModel,
    isUserUploadedModel,
} from '@services/graphql-service/notifications';
import Logo from '@svg/logo.svg';
import { BLACK_2 } from '@style/colors';

const DATE_FORMAT = 'h:mmaaaa M/dd/yy';

const Item = styled.li`
    display: flex;
    justify-content: space-between;
`;

function ActorPicture({ id, name, img }) {
    return (
        <Link to={`/profile/${id}`}>
            <ProfilePicture size="48px" name={name} src={img} />
        </Link>
    );
}

const Content = styled.div`
    margin: 16px 0 0 16px;
    flex-grow: 1;

    span + span {
        margin-left: 8px;
    }
`;

const ActorName = styled.div`
    ${commentUsername};
    margin-bottom: 8px;
`;

const Time = styled.span`
    ${commentPostedText};
`;

const Verb = styled.span`
    text-transform: capitalize;
    font-weight: 600;
    ${commentPostedText};
`;

const TargetName = styled.span`
    ${commentPostedText};
`;

function formatDate(time) {
    const formatted = DateFns.format(new Date(time), DATE_FORMAT);
    return formatted.replace('a.m.', 'am').replace('p.m.', 'pm');
}

const TargetPicture = styled(Card)`
    width: 188px;
    height: 120px;
`;

const Thumbnail = styled(ModelThumbnail)`
    border-radius: 8px;
    svg {
        width: 40px;
        height: 40px;
    }
`;

const LogoContainer = styled.div`
    height: 48px;
    width: 48px;
    border-radius: 100%;
    background-color: ${BLACK_2};
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 80%;
    }
`;

function ThangsPicture() {
    return (
        <LogoContainer>
            <img src={Logo} alt="Thangs logo" />
        </LogoContainer>
    );
}

const Text = styled.div`
    margin-top: 16px;
`;

export function Notification({
    timestamp,
    actor,
    verb,
    target,
    notificationType,
    actionObject,
    className,
}) {
    const time = formatDate(timestamp);

    if (isModelChangedStatus(notificationType)) {
        return (
            <Item className={className}>
                <ThangsPicture />
                <Content>
                    <ActorName>Thangs</ActorName>
                    <Time>{time}</Time>
                    <Text>
                        {isModelCompletedProcessing(target)
                            ? 'Your model upload is complete.'
                            : isModelFailedProcessing(target)
                            ? 'We were unable to process your model. Please try again.'
                            : null}
                    </Text>
                </Content>
                {isModelCompletedProcessing(target) ? (
                    <Link to={`/model/${target.id}`}>
                        <TargetPicture>
                            <Thumbnail
                                thumbnailUrl={target.img}
                                showStatusOverlay={!isCompleted(target)}
                                id={target.id}
                                uploadStatus={target.uploadStatus}
                                name={target.name}
                            />
                        </TargetPicture>
                    </Link>
                ) : isModelFailedProcessing(target) ? (
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={target.img}
                            showStatusOverlay={!isCompleted(target)}
                            id={target.id}
                            uploadStatus={target.uploadStatus}
                            name={target.name}
                        />
                    </TargetPicture>
                ) : null}
            </Item>
        );
    }

    return (
        <Item className={className}>
            {actor && (
                <ActorPicture name={actor.name} id={actor.id} img={actor.img} />
            )}
            <Content>
                <ActorName>{actor.name}</ActorName>
                <div>
                    <Verb>{verb}</Verb>
                    {isUserCommentedOnModel(notificationType) && (
                        <span>on</span>
                    )}
                    {isUserUploadedModel(notificationType) ? (
                        <TargetName>{actionObject.name}</TargetName>
                    ) : (
                        <TargetName>{target.name}</TargetName>
                    )}
                    <Time>{time}</Time>
                </div>
                {isUserCommentedOnModel(notificationType) && (
                    <Text>{actionObject.body}</Text>
                )}
            </Content>
            {isUserUploadedModel(notificationType) ? (
                <Link to={`/model/${actionObject.id}`}>
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={actionObject.img}
                            showStatusOverlay={!isCompleted(actionObject)}
                            id={actionObject.id}
                            uploadStatus={actionObject.uploadStatus}
                            name={actionObject.name}
                        />
                    </TargetPicture>
                </Link>
            ) : (
                target && (
                    <Link to={`/model/${target.id}`}>
                        <TargetPicture>
                            <Thumbnail
                                thumbnailUrl={target.img}
                                showStatusOverlay={!isCompleted(target)}
                                id={target.id}
                                uploadStatus={target.uploadStatus}
                                name={target.name}
                            />
                        </TargetPicture>
                    </Link>
                )
            )}
        </Item>
    );
}
