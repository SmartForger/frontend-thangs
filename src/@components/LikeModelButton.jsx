import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg';
import * as GraphqlService from '@services/graphql-service';
import { Button } from '@components/Button';

const graphqlService = GraphqlService.getInstance();

const ActionButton = styled(Button)`
    margin-bottom: 24px;
    padding: 6px 24px;
    background: ${props => props.theme.modelActionButtonBackground};
    color: ${props => props.theme.modelActionButtonText};

    > svg {
        margin-right: 8px;
        fill: ${props => props.theme.modelActionButtonText};
    }
`;

const userIdsWhoHaveLiked = R.pipe(
    R.prop('likes'),
    R.map(R.path(['owner', 'id'])),
);

export const hasLikedModel = (model, user) => {
    return R.includes(user.id, userIdsWhoHaveLiked(model));
};

export function LikeModelButton({ currentUser, model }) {
    const [likeModel] = graphqlService.useLikeModelMutation(
        currentUser.id,
        model.id,
    );
    const [unlikeModel] = graphqlService.useUnlikeModelMutation(
        currentUser.id,
        model.id,
    );
    return hasLikedModel(model, currentUser) ? (
        <ActionButton onClick={unlikeModel} maxwidth="124px">
            <HeartFilledIcon /> Liked!
        </ActionButton>
    ) : (
        <ActionButton onClick={likeModel} maxwidth="124px">
            <HeartIcon /> Like
        </ActionButton>
    );
}
