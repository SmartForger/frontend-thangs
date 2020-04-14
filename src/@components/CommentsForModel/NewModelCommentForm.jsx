import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { authenticationService } from '@services';
import * as GraphqlService from '@services/graphql-service';

const allowCssProp = props => (props.css ? props.css : '');

const graphqlService = GraphqlService.getInstance();

const NewCommentContainer = styled.div`
    margin-top: 40px;
`;

const NewCommentHeader = styled.div`
    font-size: 18px;
    font-family: ${props => props.theme.headerFont};
    margin-bottom: 16px;
`;

const PostCommentBodyTextarea = styled.textarea`
    width: 100%;
    margin-bottom: 24px;
    resize: vertical;
    min-height: 40px;
    border: none;
    box-sizing: border-box;
    padding: 4px;
    border-radius: 4px;
`;

const PostCommentButton = styled.button`
    display: block;
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.primaryButton};
    font-size: 14px;
    padding: 9px 12px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 24px;

    ${props => props.theme.shadow};
    ${allowCssProp};
`;

export function NewModelCommentForm({ modelId }) {
    const userId = authenticationService.currentUserValue.id;
    const { user } = graphqlService.useUserById(userId);

    const { register, handleSubmit, reset } = useForm();
    const [createModelComment] = graphqlService.useCreateModelCommentMutation({
        modelId,
    });

    async function formSubmit(data, e) {
        e.preventDefault();
        await createModelComment({
            variables: { input: { ownerId: userId, modelId, body: data.body } },
        });
        reset();
    }

    if (!user) {
        return null;
    }

    return (
        <NewCommentContainer>
            <NewCommentHeader>Add comment</NewCommentHeader>
            <form onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}>
                <PostCommentBodyTextarea
                    name="body"
                    ref={register({ required: true })}
                />
                <PostCommentButton
                    type="submit"
                    css={`
                        float: right;
                    `}
                >
                    Post Comment
                </PostCommentButton>
            </form>
        </NewCommentContainer>
    );
}
