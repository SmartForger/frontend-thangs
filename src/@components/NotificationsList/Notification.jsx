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
    isModelCompletedProcessing,
    isModelFailedProcessing,
    isUserCommentedOnModel,
    isUserUploadedModel,
    isUserStartedFollowingUser,
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

function ModelCompletedProcessing({ className, time, actor }) {
    return (
        <Item className={className}>
            <ThangsPicture />
            <Content>
                <ActorName>Thangs</ActorName>
                <Time>{time}</Time>
                <Text>Your model upload is complete.</Text>
            </Content>
            <Link to={`/model/${actor.id}`}>
                <TargetPicture>
                    <Thumbnail
                        thumbnailUrl={actor.thumbnailUrl}
                        showStatusOverlay={!isCompleted(actor)}
                        id={actor.id}
                        uploadStatus={actor.uploadStatus}
                        name={actor.name}
                    />
                </TargetPicture>
            </Link>
        </Item>
    );
}

function ModelFailedProcessing({ className, time, actor }) {
    return (
        <Item className={className}>
            <ThangsPicture />
            <Content>
                <ActorName>Thangs</ActorName>
                <Time>{time}</Time>
                <Text>
                    We were unable to process your model. Please try again.
                </Text>
            </Content>
            <TargetPicture>
                <Thumbnail
                    thumbnailUrl={actor.thumbnailUrl}
                    showStatusOverlay={!isCompleted(actor)}
                    id={actor.id}
                    uploadStatus={actor.uploadStatus}
                    name={actor.name}
                />
            </TargetPicture>
        </Item>
    );
}

function UserCommentedOnModel({
    className,
    time,
    actor,
    target,
    actionObject,
    verb,
}) {
    return (
        <Item className={className}>
            <ActorPicture
                name={actor.fullName}
                id={actor.id}
                img={actor.profile.avatarUrl}
            />
            <Content>
                <ActorName>{actor.fullName}</ActorName>

                <div>
                    <Verb>{verb}</Verb>
                    <span>on</span>
                    <TargetName>{target.name}</TargetName>
                    <Time>{time}</Time>
                </div>
                <Text>{actionObject.body}</Text>
            </Content>
            <Link to={`/model/${target.id}`}>
                <TargetPicture>
                    <Thumbnail
                        thumbnailUrl={target.thumbnailUrl}
                        showStatusOverlay={!isCompleted(target)}
                        id={target.id}
                        uploadStatus={target.uploadStatus}
                        name={target.name}
                    />
                </TargetPicture>
            </Link>
        </Item>
    );
}

function UserUploadedModel({
    className,
    time,
    actor,
    verb,
    target,
    actionObject,
}) {
    return (
        <Item className={className}>
            <ActorPicture
                name={actor.fullName}
                id={actor.id}
                img={actor.profile.avatarUrl}
            />
            <Content>
                <ActorName>{actor.fullName}</ActorName>

                <div>
                    <Verb>{verb}</Verb>
                    <TargetName>{actionObject.name}</TargetName>
                    <Time>{time}</Time>
                </div>
            </Content>
            <Link to={`/model/${actionObject.id}`}>
                <TargetPicture>
                    <Thumbnail
                        thumbnailUrl={actionObject.thumbnailUrl}
                        showStatusOverlay={!isCompleted(actionObject)}
                        id={actionObject.id}
                        uploadStatus={actionObject.uploadStatus}
                        name={actionObject.name}
                    />
                </TargetPicture>
            </Link>
        </Item>
    );
}

function UserLikedModel({
    className,
    time,
    actor,
    verb,
    target,
    actionObject,
}) {
    return (
        <Item className={className}>
            <ActorPicture
                name={actor.fullName}
                id={actor.id}
                img={actor.profile.avatarUrl}
            />
            <Content>
                <ActorName>{actor.fullName}</ActorName>

                <div>
                    <Verb>{verb}</Verb>
                    <TargetName>{target.name}</TargetName>
                    <Time>{time}</Time>
                </div>
            </Content>
            <Link to={`/model/${target.id}`}>
                <TargetPicture>
                    <Thumbnail
                        thumbnailUrl={target.thumbnailUrl}
                        showStatusOverlay={!isCompleted(target)}
                        id={target.id}
                        uploadStatus={target.uploadStatus}
                        name={target.name}
                    />
                </TargetPicture>
            </Link>
        </Item>
    );
}

function UserStartedFollowingUser({
    className,
    time,
    actor,
    verb,
    target,
    actionObject,
}) {
    return (
        <Item className={className}>
            <ActorPicture
                name={actor.fullName}
                id={actor.id}
                img={actor.profile.avatarUrl}
            />
            <Content>
                <ActorName>{actor.fullName}</ActorName>

                <div>
                    <Verb>{verb}</Verb>
                    <TargetName>you</TargetName>
                    <Time>{time}</Time>
                </div>
            </Content>
        </Item>
    );
}

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

    if (isModelFailedProcessing(notificationType)) {
        return (
            <ModelFailedProcessing
                className={className}
                time={time}
                actor={actor}
                verb={verb}
            />
        );
    }

    if (isModelCompletedProcessing(notificationType)) {
        return (
            <ModelCompletedProcessing
                className={className}
                time={time}
                actor={actor}
                verb={verb}
            />
        );
    }

    if (isUserCommentedOnModel(notificationType)) {
        return (
            <UserCommentedOnModel
                className={className}
                time={time}
                actor={actor}
                target={target}
                actionObject={actionObject}
                verb={verb}
            />
        );
    }

    if (isUserUploadedModel(notificationType)) {
        return (
            <UserUploadedModel
                className={className}
                time={time}
                actor={actor}
                target={target}
                actionObject={actionObject}
                verb={verb}
            />
        );
    }

    if (isUserStartedFollowingUser(notificationType)) {
        return (
            <UserStartedFollowingUser
                className={className}
                time={time}
                actor={actor}
                target={target}
                actionObject={actionObject}
                verb={verb}
            />
        );
    }

    return (
        <UserLikedModel
            className={className}
            time={time}
            actor={actor}
            target={target}
            verb={verb}
        />
    );
}
