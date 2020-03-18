import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const Comments = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

const CommentStyled = styled.li`
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

const Date = styled.div`
    color: ${props => props.theme.darkgrey};
`;

const Body = styled.div`
    margin-bottom: 4px;
`;

const Text = styled.span``;

const Comment = ({ comment }) => {
    return (
        <CommentStyled>
            <Body>
                <Owner owner={comment.owner} />
                <Text>{comment.body}</Text>
            </Body>
            <Date>{comment.created}</Date>
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

const CommentsForModel = ({ model }) => {
    const { loading, erros, comments } = graphqlService.useAllModelComments(
        model.id,
    );

    if (!comments || comments.length === 0) {
        return null;
    }

    return (
        <Container>
            <Header>Comments</Header>
            <Comments>
                {comments.map((comment, i) => (
                    <Comment key={i} comment={comment} />
                ))}
            </Comments>
        </Container>
    );
};

export { CommentsForModel };
