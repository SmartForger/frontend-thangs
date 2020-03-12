import React from 'react';
import styled from 'styled-components';
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
                {likes.map(({ owner: { firstName, lastName } }) => (
                    <li>
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
    if (!user) {
        return <Button disabled>Like</Button>;
    } else if (hasLikedModel(model, user)) {
        return <Button>Unlike</Button>;
    }
    return <Button>Like</Button>;
};

const ModelPage = ({ model, user }) => {
    return (
        <div>
            <Name name={model.name} />
            <Owner owner={model.owner} />
            <Likes likes={model.likes} />
            <LikeButton user={user} model={model} />
        </div>
    );
};

export { ModelPage };
