import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import * as DateFns from 'date-fns';
import { ProfilePicture } from '@components/ProfilePicture';
import { ModelThumbnail } from '@components/ModelThumbnail';
import { Card } from '@components/Card';
import { commentUsername } from '@style/text';
import { commentPostedText } from '@style/text';
import {
    isModelCompletedProcessing,
    isModelFailedProcessing,
    isUserCommentedOnModel,
    isUserUploadedModel,
    isUserStartedFollowingUser,
    isUserGrantedUserAccessToFolder,
} from '@services/graphql-service/notifications';
import { BLACK_2 } from '@style/colors';

const DATE_FORMAT = 'h:mmaaaa M/dd/yy';

const Item = styled.li`
    display: flex;
`;

function Body({ left, content, right, className }) {
    return (
        <Item className={className}>
            <Left>{left}</Left>
            <Content>{content}</Content>
            <Right>{right}</Right>
        </Item>
    );
}

function ActorPicture({ id, name, img }) {
    return (
        <Link to={`/profile/${id}`}>
            <ProfilePicture size="48px" name={name} src={img} />
        </Link>
    );
}

const Left = styled.div`
    min-width: 48px;
`;

const Right = styled.div`
    min-width: 188px;
`;

const Content = styled.div`
    margin: 16px 0 0 16px;
    max-width: calc(100% - 188px - 48px);
    min-width: calc(100% - 188px - 48px);

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
    min-width: 48px;
    max-width: 48px;
    border-radius: 100%;
    background-color: ${BLACK_2};
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 80%;
    }
`;

const Image = styled.img`
    max-width: 24px;
`;

function ThangsPicture() {
    return (
        <LogoContainer>
            <Image src="/thangs-logo.png" alt="Thangs logo" />
        </LogoContainer>
    );
}

const Text = styled.div`
    margin-top: 16px;
`;

const TruncateOverflow = styled.div`
    overflow-x: hidden;
    text-overflow: ellipsis;
`;

function ModelCompletedProcessing({ className, time, actor }) {
    return (
        <Body
            className={className}
            left={<ThangsPicture />}
            content={
                <div>
                    <ActorName>Thangs</ActorName>
                    <Time>{time}</Time>
                    <Text>We have finished processing your model.</Text>
                </div>
            }
            right={
                <Link to={`/model/${actor.id}`}>
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={actor.thumbnailUrl}
                            name={actor.name}
                        />
                    </TargetPicture>
                </Link>
            }
        />
    );
}

function ModelFailedProcessing({ className, time, actor }) {
    return (
        <Body
            className={className}
            left={<ThangsPicture />}
            content={
                <div>
                    <ActorName>Thangs</ActorName>
                    <Time>{time}</Time>
                    <Text>
                        We were unable to process your model. Please try again.
                    </Text>
                </div>
            }
            right={
                <Link to={`/model/${actor.id}`}>
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={actor.thumbnailUrl}
                            name={actor.name}
                        />
                    </TargetPicture>
                </Link>
            }
        />
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
        <Body
            className={className}
            left={
                <ActorPicture
                    name={actor.fullName}
                    id={actor.id}
                    img={actor.profile.avatarUrl}
                />
            }
            content={
                <div>
                    <ActorName>{actor.fullName}</ActorName>

                    <TruncateOverflow>
                        <Verb>{verb}</Verb>
                        <span>on</span>
                        <TargetName>{target.name}</TargetName>
                    </TruncateOverflow>
                    <Time>{time}</Time>
                    <Text>
                        <TruncateOverflow>{actionObject.body}</TruncateOverflow>
                    </Text>
                </div>
            }
            right={
                <Link to={`/model/${target.id}`}>
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={target.thumbnailUrl}
                            name={target.name}
                        />
                    </TargetPicture>
                </Link>
            }
        />
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
        <Body
            className={className}
            left={
                <ActorPicture
                    name={actor.fullName}
                    id={actor.id}
                    img={actor.profile.avatarUrl}
                />
            }
            content={
                <div>
                    <ActorName>{actor.fullName}</ActorName>

                    <div>
                        <Verb>{verb}</Verb>
                        <TargetName>{actionObject.name}</TargetName>
                    </div>
                    <Time>{time}</Time>
                </div>
            }
            right={
                <Link to={`/model/${actionObject.id}`}>
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={actionObject.thumbnailUrl}
                            name={actionObject.name}
                        />
                    </TargetPicture>
                </Link>
            }
        />
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
        <Body
            className={className}
            left={
                <ActorPicture
                    name={actor.fullName}
                    id={actor.id}
                    img={actor.profile.avatarUrl}
                />
            }
            content={
                <div>
                    <ActorName>{actor.fullName}</ActorName>

                    <div>
                        <Verb>{verb}</Verb>
                        <TargetName>{target.name}</TargetName>
                    </div>
                    <Time>{time}</Time>
                </div>
            }
            right={
                <Link to={`/model/${target.id}`}>
                    <TargetPicture>
                        <Thumbnail
                            thumbnailUrl={target.thumbnailUrl}
                            name={target.name}
                        />
                    </TargetPicture>
                </Link>
            }
        />
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
        <Body
            className={className}
            left={
                <ActorPicture
                    name={actor.fullName}
                    id={actor.id}
                    img={actor.profile.avatarUrl}
                />
            }
            content={
                <div>
                    <ActorName>{actor.fullName}</ActorName>

                    <div>
                        <Verb>{verb}</Verb>
                        <TargetName>you</TargetName>
                    </div>
                    <Time>{time}</Time>
                </div>
            }
        />
    );
}

function UserGrantedUserAccessToFolder({
    className,
    time,
    actor,
    verb,
    target,
    actionObject,
}) {
    return (
        <Body
            className={className}
            left={
                <ActorPicture
                    name={actor.fullName}
                    id={actor.id}
                    img={actor.profile.avatarUrl}
                />
            }
            content={
                <div>
                    <ActorName>{actor.fullName}</ActorName>

                    <TruncateOverflow>
                        <Verb>Granted you access</Verb>
                        <TargetName>
                            to a folder{' '}
                            <Link to={`/folder/${target.id}`}>
                                {target.name}
                            </Link>
                        </TargetName>
                    </TruncateOverflow>
                    <Time>{time}</Time>
                </div>
            }
        />
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
    } else if (isModelCompletedProcessing(notificationType)) {
        return (
            <ModelCompletedProcessing
                className={className}
                time={time}
                actor={actor}
                verb={verb}
            />
        );
    } else if (isUserCommentedOnModel(notificationType)) {
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
    } else if (isUserUploadedModel(notificationType)) {
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
    } else if (isUserStartedFollowingUser(notificationType)) {
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
    } else if (isUserGrantedUserAccessToFolder(notificationType)) {
        return (
            <UserGrantedUserAccessToFolder
                className={className}
                time={time}
                actor={actor}
                target={target}
                actionObject={actionObject}
                verb={verb}
            />
        );
    } else {
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
}
