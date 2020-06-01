import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import * as GraphqlService from '@services/graphql-service';
import { useCurrentUser } from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { Message404 } from '../404';
import { CardCollection } from '@components/CardCollection';
import { subheaderText } from '@style/text';

const graphqlService = GraphqlService.getInstance();
const getLikedModels = R.pathOr([], ['likedModels']);

const LikedModelsHeader = styled.div`
    ${subheaderText}
    margin-bottom: 30px;
`;

function LikesCount({ user }) {
    const likes = getLikedModels(user);
    const amount = likes.length;

    return <LikedModelsHeader>Liked Models {amount}</LikedModelsHeader>;
}

function LikesContent({ user }) {
    const models = getLikedModels(user);
    return (
        <CardCollection
            models={models}
            noResultsText="This user has not liked any models yet."
        />
    );
}

const Page = () => {
    const { id } = useParams();
    const { user } = useCurrentUser();
    const { loading, error } = graphqlService.useUserById(id);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div data-cy="fetch-profile-error">
                Error! We were not able to load this profile. Please try again
                later.
            </div>
        );
    }

    if (!user) {
        return (
            <div data-cy="fetch-profile-error">
                <Message404 />
            </div>
        );
    }
    return (
        <>
            <LikesCount user={user} />
            <LikesContent user={user} />
        </>
    );
};

const Likes = WithNewThemeLayout(Page);

export { Likes };
