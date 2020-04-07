import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Button } from '@components';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const FullButton = styled(Button)`
    max-width: 100%;
`;

const LikesCount = ({ likes }) => {
    const amount = likes.filter(fields => fields.isLiked).length;
    return <div>Likes: {amount}</div>;
};

const userIdsWhoHaveLiked = R.pipe(
    R.prop('likes'),
    R.filter(R.propEq('isLiked', true)),
    R.map(R.path(['owner', 'id'])),
);

const hasLikedModel = (model, user) => {
    return R.includes(user.id, userIdsWhoHaveLiked(model));
};

const LikeButton = ({ model, user }) => {
    const [likeModel] = graphqlService.useLikeModelMutation(user.id, model.id);
    return <FullButton onClick={likeModel}>Like</FullButton>;
};

const DisabledLikeButton = () => {
    return <FullButton disabled>Like</FullButton>;
};

const UnlikeButton = ({ model, user }) => {
    const [unlikeModel] = graphqlService.useUnlikeModelMutation(
        user.id,
        model.id,
    );
    return <FullButton onClick={unlikeModel}>Unlike</FullButton>;
};

const ButtonForLikes = ({ model, user }) => {
    if (!user) {
        return <DisabledLikeButton />;
    } else if (hasLikedModel(model, user)) {
        return <UnlikeButton model={model} user={user} />;
    }
    return <LikeButton model={model} user={user} />;
};

const Container = styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    align-items: center;
`;

const Likes = ({ model, user }) => {
    return (
        <Container>
            <LikesCount likes={model.likes} />
            <ButtonForLikes model={model} user={user} />
        </Container>
    );
};

export { Likes };
