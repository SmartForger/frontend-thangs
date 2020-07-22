import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import * as GraphqlService from '@services/graphql-service';
import { Markdown } from '@components';
import { Spinner } from '@components/Spinner';
import { ProfilePicture } from '@components/ProfilePicture';
import { NewModelCommentForm } from './NewModelCommentForm';
import { subheaderText, commentPostedText, commentUsername } from '@style/text';
import { VersionPicture } from '@components/VersionPicture';

const graphqlService = GraphqlService.getInstance();

const allowCssProp = props => (props.css ? props.css : '');

const Comments = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

const CommentStyled = styled.li`
    display: flex;
    margin-top: 40px;

    ${allowCssProp};
`;

const Box = styled.div`
    background-color: ${props => props.theme.grey};
`;

const ProfilePictureStyled = styled(ProfilePicture)`
    margin-right: 16px;
`;

const TimeAgo = styled.div`
    ${commentPostedText};
`;

const Body = styled.div`
`;

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const Name = styled.div`
    ${commentUsername};
    margin-bottom: 16px;
`;

const Comment = ({ comment }) => {
    const time = formatDistance(new Date(comment.created), new Date());
    const { owner, body } = comment;
    return (
        <CommentStyled>
            <Link to={`/profile/${owner.id}`}>
                <ProfilePictureStyled
                    size="48px"
                    name={owner.fullName}
                    src={owner.profile.avatarUrl}
                />
            </Link>
            <FlexGrow>
                <Box>
                    <Body>
                        <Name>{owner.fullName}</Name>
                        <TimeAgo>Posted {time} ago</TimeAgo>
                        <Markdown>{body}</Markdown>
                    </Body>
                </Box>
            </FlexGrow>
        </CommentStyled>
    );
};


const VersionEntry = ( ) => {
    const time = formatDistance(new Date(), new Date());
    const  body = 'TEMPLATE: Version of Template Model uploaded'
    return (
        <CommentStyled>
            <VersionPicture
                    size="48px"
                    color="blue"
                />
            <FlexGrow>
                <Box>
                    <Body>
                        <Markdown>{body}</Markdown>
                        <TimeAgo>Tem Plate / {time}</TimeAgo>
                    </Body>
                </Box>
            </FlexGrow>
        </CommentStyled>
    );
};

const Header = styled.h2`
    ${subheaderText};
`;

const CommentsForModel = ({ model, className }) => {
    const { loading, error, comments } = graphqlService.useAllModelComments(
        model.id
    );

    if (error) {
        return <div className={className}>Error loading comments</div>;
    }

    if (loading) {
        return (
            <div className={className}>
                <Spinner />
            </div>
        );
    }

    const commentsHeaderText =
        comments.length > 1 || comments.length === 0 ? 'Comments' : 'Comment';
    return (
        <div className={className}>
            <Header>
                {comments.length} {commentsHeaderText}
            </Header>
            <Comments>
           
                <VersionEntry />

                {comments.map((comment, i) => (
                    <Comment key={i} comment={comment} />
                ))}
                
            </Comments>
            <NewModelCommentForm modelId={model.id} />
        </div>
    );
};

export { CommentsForModel };
