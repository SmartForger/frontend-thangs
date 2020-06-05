import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { WithNewThemeLayout } from '@style/Layout';
import { useCurrentUser } from '@customHooks/Users';
import { ProfilePicture } from '@components/ProfilePicture';
import { DarkButton } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { ChangeablePicture } from '@components/ChangeablePicture';
import { Flash } from '@components/Flash';
import { EditProfileForm } from '@components/EditProfileForm';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const ProfilePictureStyled = styled(ProfilePicture)`
    margin-right: 24px;
`;

const DeleteButton = styled(DarkButton)`
    padding: 8px 24px;
`;

function PictureForm({ user, className }) {
    const [
        deleteProfileAvatar,
        { loading },
    ] = graphqlService.useDeleteUserAvatarMutation(user);
    const onDelete = () => deleteProfileAvatar();
    const deleteText = loading ? 'Deleting...' : 'Delete';

    const currentAvatar = user && user.profile && user.profile.avatarUrl;
    return (
        <Row className={className}>
            <ProfilePictureStyled
                size="80px"
                name={user.fullName}
                src={user.profile.avatarUrl}
            />
            <div>
                <Row>
                    <ChangeablePicture
                        user={user}
                        css={`
                            margin-right: 8px;
                        `}
                    />

                    {currentAvatar && (
                        <DeleteButton onClick={onDelete} disabled={loading}>
                            {deleteText}
                        </DeleteButton>
                    )}
                </Row>
                <Row
                    css={`
                        margin-top: 16px;
                    `}
                >
                    <Link to={`/profile/${user.id}`}>View Profile</Link>
                </Row>
            </div>
        </Row>
    );
}

function WarningOnEmptyProfile({ user }) {
    if (!user.profile.description) {
        return (
            <Flash>
                Add information about yourself below to let others know your
                specialties, interests, etc.
            </Flash>
        );
    }
    return null;
}

function Page() {
    const { loading, error, user } = useCurrentUser();

    if (loading) {
        return <Spinner />;
    }

    if (error || !user) {
        return (
            <div data-cy="fetch-results-error">
                Error! We were not able to load your profile. Please try again
                later.
            </div>
        );
    }

    return (
        <div>
            <WarningOnEmptyProfile user={user} />
            <PictureForm
                user={user}
                css={`
                    margin-bottom: 64px;
                `}
            />
            <EditProfileForm user={user} />
        </div>
    );
}

const EditProfile = WithNewThemeLayout(Page);

export { EditProfile };
