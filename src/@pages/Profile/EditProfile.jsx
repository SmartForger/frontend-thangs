import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { WithNewThemeLayout } from '@style/Layout';
import { useCurrentUser } from '@customHooks/Users';
import { ProfilePicture } from '@components/ProfilePicture';
import { Button as _Button } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { ChangeablePicture } from '@components/ChangeablePicture';
import { FlashContext } from '@components/Flash';
import { EditProfileForm } from '@components/EditProfileForm';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const Name = styled.div`
    font-family: ${props => props.theme.mainFont};
    font-size: 24px;
    color: ${props => props.theme.profileNameColor};
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const ProfilePictureStyled = styled(ProfilePicture)`
    margin-right: 24px;
`;

const allowCssProp = props => (props.css ? props.css : '');

const DeleteButton = styled(_Button)`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.deleteButton};
    padding: 8px 24px;
`;

function PictureForm({ user, className }) {
    const buttonRef = useRef();

    const [
        deleteProfileAvatar,
        { loading },
    ] = graphqlService.useDeleteUserAvatarMutation(user);
    const onDelete = () => deleteProfileAvatar();
    const deleteText = loading ? 'Deleting...' : 'Delete';

    return (
        <Row className={className}>
            <ProfilePictureStyled user={user} size="80px" />
            <ChangeablePicture
                user={user}
                css={`
                    margin-right: 8px;
                `}
            />

            <DeleteButton onClick={onDelete} disabled={loading}>
                {deleteText}
            </DeleteButton>
        </Row>
    );
}

const PictureFormStyled = styled(PictureForm)`
    margin-top: 64px;

    ${allowCssProp};
`;

function InlineProfile({ user }) {
    return (
        <Row>
            <ProfilePictureStyled user={user} size="50px" />
            <Name>{user.fullName}</Name>
        </Row>
    );
}

function WarningOnEmptyProfile({ user }) {
    const [, setFlash] = useContext(FlashContext);
    useEffect(
        () => {
            if (!user.profile.description) {
                setFlash(
                    'Add information about yourself below to let others know your specialties, interests, etc.'
                );
            }
        },
        [setFlash, user]
    );

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
            <InlineProfile user={user} />
            <PictureFormStyled
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
