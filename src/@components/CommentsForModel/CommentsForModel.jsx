import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import * as GraphqlService from '@services/graphql-service';
import { Markdown } from '@components';
import { Spinner } from '@components/Spinner';
import { ProfilePicture } from '@components/ProfilePicture';
import { NewModelCommentForm } from './NewModelCommentForm';
import { subheaderText, commentPostedText } from '@style/text';

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

const ProfileLink = styled(Link)`
    font-weight: 500;
    text-decoration: none;
`;

const ProfilePictureStyled = styled(ProfilePicture)`
    margin-right: 16px;
`;

const TimeAgo = styled.div`
    ${commentPostedText};
    margin-bottom: 16px;
`;

const Body = styled.div`
    margin-bottom: 4px;
`;

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const Comment = ({ comment }) => {
    const time = formatDistance(new Date(comment.created), new Date());
    const { owner, body } = comment;
    return (
        <CommentStyled>
            <ProfileLink to={`/profile/${owner.id}`}>
                <ProfilePictureStyled size="48px" user={owner} />
            </ProfileLink>
            <FlexGrow>
                <Box>
                    <Body>
                        <ProfileLink to={`/profile/${owner.id}`}>
                            {owner.fullName}
                        </ProfileLink>
                        <TimeAgo>{time} ago</TimeAgo>
                        <Markdown>{body}</Markdown>
                    </Body>
                </Box>
            </FlexGrow>
        </CommentStyled>
    );
};

const Header = styled.h2`
    ${subheaderText};
`;

const Container = styled.div`
    max-width: 500px;
`;

const CommentsForModel = ({ model, className }) => {
    const { loading, error, comments } = graphqlService.useAllModelComments(
        model.id
    );

    if (error) {
        return (
            <Container className={className}>
                <div>Error loading comments</div>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className={className}>
                <Spinner />
            </Container>
        );
    }

    const commentsHeaderText =
        comments.length > 1 || comments.length === 0 ? 'Comments' : 'Comment';
    return (
        <Container className={className}>
            <Header>
                {comments.length} {commentsHeaderText}
            </Header>
            <Comments>
                {comments.map((comment, i) => (
                    <Comment key={i} comment={comment} />
                ))}
            </Comments>
            <NewModelCommentForm modelId={model.id} />
        </Container>
    );
};

export { CommentsForModel };
