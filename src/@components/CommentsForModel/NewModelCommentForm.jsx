import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { authenticationService } from '@services';
import * as GraphqlService from '@services/graphql-service';
import { formCalloutText } from '@style/text';
import { Button } from '@components/Button';

const graphqlService = GraphqlService.getInstance();

const NewCommentContainer = styled.div`
    margin-top: 40px;
`;

const NewCommentHeader = styled.div`
    ${formCalloutText};
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

const PostCommentButton = styled(Button)`
    margin-bottom: 24px;
    float: right;
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
            <NewCommentHeader>Add Comment</NewCommentHeader>
            <form onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}>
                <PostCommentBodyTextarea
                    name="body"
                    ref={register({ required: true })}
                />
                <PostCommentButton type="submit">
                    Post Comment
                </PostCommentButton>
            </form>
        </NewCommentContainer>
    );
}
