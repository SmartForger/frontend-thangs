import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { authenticationService } from '@services';
import * as GraphqlService from '@services/graphql-service';
import { Markdown } from '@components';

const graphqlService = GraphqlService.getInstance();

const allowCssProp = props => (props.css ? props.css : '');

const Comments = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;

    > li {
        margin-top: 2px;
    }
`;

const CommentStyled = styled.li`
    display: flex;

    ${allowCssProp};
`;

const Box = styled.div`
    border: 1px solid black;
    border-radius: 4px;
    padding: 4px;
    background-color: ${props => props.theme.grey};
`;

const OwnerStyled = styled(Link)`
    font-weight: bold;
    margin-right: 4px;
    text-decoration: none;
`;

const Owner = ({ owner }) => {
    return (
        <OwnerStyled to={`/profile/${owner.id}`}>
            {owner.firstName} {owner.lastName}:
        </OwnerStyled>
    );
};

const Picture = styled.img`
    border-radius: 100%;
    height: 50px;
    margin-right: 8px;
`;

const OwnerPicture = ({ owner }) => {
    return <Picture src={owner.profile.avatar} />;
};

const TimeAgo = styled.div`
    color: ${props => props.theme.darkgrey};
`;

const Body = styled.div`
    margin-bottom: 4px;
`;

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const Comment = ({ comment }) => {
    const time = formatDistance(new Date(comment.created), new Date());

    return (
        <CommentStyled>
            <div>
                <OwnerPicture owner={comment.owner} />
            </div>
            <FlexGrow>
                <Box>
                    <Body>
                        <Owner owner={comment.owner} />
                        <Markdown>{comment.body}</Markdown>
                    </Body>
                    <TimeAgo>{time} ago</TimeAgo>
                </Box>
            </FlexGrow>
        </CommentStyled>
    );
};

const Header = styled.div`
    font-size: 16px;
    text-align: center;
`;

const Container = styled.div`
    max-width: 500px;
`;

const Text = styled.div`
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;

    &:focus:before {
        color: ${props => props.theme.darkgrey};
    }
`;

const valid = body => {
    return !!body;
};

const NewComment = ({ modelId }) => {
    const userId = authenticationService.currentUserValue.id;
    const { loading, error, user } = graphqlService.useUserById(userId);

    const [body, setBody] = useState('');
    const [createModelComment] = graphqlService.useCreateModelCommentMutation({
        ownerId: userId,
        body,
        modelId,
    });

    if (!user) {
        return null;
    }

    const handleInput = e => {
        setBody(e.target.innerText);
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur();

            if (valid(body)) {
                createModelComment();
                setBody('');
            }
        }
    };

    return (
        <CommentStyled
            css={`
                margin-top: 12px;
            `}
            onKeyPress={handleKeyPress}
        >
            <div>
                <OwnerPicture owner={user} />
            </div>
            <FlexGrow>
                <Box>
                    <Text
                        contentEditable
                        data-placeholder="Write a comment..."
                        onInput={handleInput}
                    />
                </Box>
            </FlexGrow>
        </CommentStyled>
    );
};

const CommentsForModel = ({ model }) => {
    const { loading, erros, comments } = graphqlService.useAllModelComments(
        model.id,
    );

    return (
        <Container>
            <Header>Comments</Header>
            <Comments>
                {comments.map((comment, i) => (
                    <Comment key={i} comment={comment} />
                ))}
            </Comments>
            <NewComment modelId={model.id} />
        </Container>
    );
};

export { CommentsForModel };
