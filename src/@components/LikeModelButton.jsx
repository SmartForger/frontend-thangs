import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg';
import * as GraphqlService from '@services/graphql-service';
import { SecondaryButton } from '@components/Button';

const graphqlService = GraphqlService.getInstance();

const ActionButton = styled(SecondaryButton)`
    margin-bottom: 24px;
    max-width: 124px;
    padding: 6px 24px;

    > svg {
        margin-right: 8px;
    }
`;

const userIdsWhoHaveLiked = R.pipe(
    R.prop('likes'),
    R.map(R.path(['owner', 'id']))
);

export const hasLikedModel = (model, user) => {
    return R.includes(user.id, userIdsWhoHaveLiked(model));
};

export function LikeModelButton({ currentUser, model }) {
    const [likeModel] = graphqlService.useLikeModelMutation(
        currentUser.id,
        model.id
    );
    const [unlikeModel] = graphqlService.useUnlikeModelMutation(
        currentUser.id,
        model.id
    );
    return hasLikedModel(model, currentUser) ? (
        <ActionButton onClick={unlikeModel}>
            <HeartFilledIcon /> Liked!
        </ActionButton>
    ) : (
        <ActionButton onClick={likeModel}>
            <HeartIcon /> Like
        </ActionButton>
    );
}
