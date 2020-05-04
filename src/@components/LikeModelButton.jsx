import React from 'react';
import * as R from 'ramda';
import styled, { css } from 'styled-components';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg';
import * as GraphqlService from '@services/graphql-service';
import { SecondaryButton, DarkButton } from '@components/Button';

const graphqlService = GraphqlService.getInstance();

const ButtonStyles = css`
    margin-bottom: 24px;
    max-width: 124px;
    padding: 6px 24px;

    > svg {
        margin-right: 8px;
    }
`;

const LikeButton = styled(SecondaryButton)`
    ${ButtonStyles}
`;

const LikedButton = styled(DarkButton)`
    ${ButtonStyles};
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
        <LikedButton onClick={unlikeModel}>
            <HeartFilledIcon /> Liked!
        </LikedButton>
    ) : (
        <LikeButton onClick={likeModel}>
            <HeartIcon /> Like
        </LikeButton>
    );
}
