import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
// TODO: Update this import when we get the proper asset.
import { ReactComponent as HeartFilledIcon } from '@svg/heart-icon.svg';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const ActionButton = styled.button`
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 28px;
    font-family: Montserrat-Medium;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    border: none;

    background: ${props => props.theme.modelActionButtonBackground};
    color: ${props => props.theme.modelActionButtonText};
    > svg {
        margin-right: 8px
        fill: ${props => props.theme.modelActionButtonText};
    }
`;

const userIdsWhoHaveLiked = R.pipe(
    R.prop('likes'),
    R.filter(R.propEq('isLiked', true)),
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
