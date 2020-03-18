import React from 'react';
import * as R from 'ramda';
import * as GraphqlService from '@services/graphql-service';
import { Button } from '@components';

const graphqlService = GraphqlService.getInstance();

const Name = ({ name }) => {
    return <div>Name: {name}</div>;
};

const Likes = ({ likes }) => {
    const amount = likes.filter(fields => fields.isLiked).length;
    return (
        <div>
            <div>Likes: {amount}</div>
            <ul>
                {likes.map(({ owner: { firstName, lastName } }, i) => (
                    <li key={i}>
                        {firstName} {lastName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Owner = ({ owner }) => {
    return (
        <div>
            Created by: {owner.firstName} {owner.lastName}
        </div>
    );
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
    return <Button onClick={likeModel}>Like</Button>;
};
const DisabledLikeButton = () => {
    return <Button disabled>Like</Button>;
};

const UnlikeButton = ({ model, user }) => {
    const [unlikeModel] = graphqlService.useUnlikeModelMutation(
        user.id,
        model.id,
    );
    return <Button onClick={unlikeModel}>Unlike</Button>;
};

const ButtonForLikes = ({ model, user }) => {
    if (!user) {
        return <DisabledLikeButton />;
    } else if (hasLikedModel(model, user)) {
        return <UnlikeButton model={model} user={user} />;
    }
    return <LikeButton model={model} user={user} />;
};

const ModelPage = ({ model, user }) => {
    return (
        <div>
            <Name name={model.name} />
            <Owner owner={model.owner} />
            <Likes likes={model.likes} />
            <ButtonForLikes user={user} model={model} />
        </div>
    );
};

export { ModelPage };
