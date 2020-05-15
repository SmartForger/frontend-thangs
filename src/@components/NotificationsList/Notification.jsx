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
`;

const ActorName = styled.div`
    ${commentUsername};
    margin-bottom: 8px;
`;

const Time = styled.span`
    ${commentPostedText};
    margin-left: 8px;
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

const ObjectPicture = styled(Card)`
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

export function Notification({
    timestamp,
    actor,
    subject,
    verb,
    target,
    object,
    className,
}) {
    const time = formatDate(timestamp);

    return (
        <Item className={className}>
            {subject && (
                <ActorPicture
                    name={subject.name}
                    id={subject.id}
                    img={subject.img}
                />
            )}
            <Content>
                <ActorName>{actor.name}</ActorName>
                <div>
                    <Verb>{verb}</Verb> <TargetName>{target.name}</TargetName>
                    <Time>{time}</Time>
                </div>
            </Content>
            {object && (
                <ObjectPicture>
                    <Thumbnail
                        thumbnailUrl={object.img}
                        showStatusOverlay={!isCompleted(object)}
                        id={object.id}
                        uploadStatus={object.uploadStatus}
                        name={object.name}
                    />
                </ObjectPicture>
            )}
        </Item>
    );
}
