import React from 'react';
import styled from 'styled-components';
import { Button } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const SpinnerStyled = styled(Spinner)`
    width: 18px;
    height: 18px;
    & .path {
        stroke: currentColor;
    }
`;

const SmallErrorIconStyled = styled(ErrorIcon)`
    width: 18px;
    height: 18px;
`;

const ButtonStyled = styled(Button)`
    margin-top: 16px;
    width: 100px;
`;

function FollowButton({ user, viewedUser }) {
    const [
        followUser,
        { loading, error },
    ] = graphqlService.useFollowUserMutation(viewedUser);
    const handleClick = e => {
        e.preventDefault();
        followUser();
    };
    return (
        <ButtonStyled disabled={loading || error} onClick={handleClick}>
            {loading ? (
                <SpinnerStyled />
            ) : error ? (
                <SmallErrorIconStyled />
            ) : (
                'Follow'
            )}
        </ButtonStyled>
    );
}

function UnfollowButton({ user, viewedUser }) {
    const [
        unfollowUser,
        { loading, error },
    ] = graphqlService.useUnfollowUserMutation(viewedUser);
    const handleClick = e => {
        e.preventDefault();
        unfollowUser();
    };
    return (
        <ButtonStyled disabled={loading || error} onClick={handleClick}>
            {loading ? (
                <SpinnerStyled />
            ) : error ? (
                <SmallErrorIconStyled />
            ) : (
                'Unfollow'
            )}
        </ButtonStyled>
    );
}

export function ToggleFollowButton({ viewedUser }) {
    const isFollowing = viewedUser.isBeingFollowedByRequester;
    return isFollowing ? (
        <UnfollowButton viewedUser={viewedUser} />
    ) : (
        <FollowButton viewedUser={viewedUser} />
    );
}
