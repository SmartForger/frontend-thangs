import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import * as GraphqlService from '@services/graphql-service';
import { Button, CommentsForModel } from '@components';

const graphqlService = GraphqlService.getInstance();

const Name = styled.h1`
    border-right: 2px solid ${props => props.theme.black};
    padding-right: 8px;
    margin: 0 8px 0 0;
`;

const OwnerStyled = styled.h3`
    padding-top: 2px;
    margin: 0;
`;

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
    if (!owner) {
        return null;
    }

    return (
        <OwnerStyled>
            Uploaded By: {owner.firstName} {owner.lastName}
        </OwnerStyled>
    );
};

const HeaderStyled = styled.div`
    grid-area: header;
    display: flex;
    align-items: center;
`;

const Header = ({ owner, name }) => {
    return (
        <HeaderStyled>
            <Name>{name}</Name>
            <Owner owner={owner} />
        </HeaderStyled>
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
            <Header name={model.name} owner={model.owner} />
            <Likes likes={model.likes} />
            <ButtonForLikes user={user} model={model} />
            <CommentsForModel model={model} />
        </div>
    );
};

export { ModelPage };
