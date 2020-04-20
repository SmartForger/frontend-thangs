import React, { useRef, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { WithNewThemeLayout } from '@style/Layout';
import { useCurrentUser } from '@customHooks/Users';
import { ProfilePicture } from '@components/ProfilePicture';
import { Button as _Button } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { ChangeablePicture } from '@components/ChangeablePicture';
import { FlashContext } from '@components/Flash';
import { EditProfileForm } from '@components/EditProfileForm';

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

const Button = styled(_Button)`
    padding: 8px 36px;
    max-width: 100%;

    ${allowCssProp};
`;

const DeleteButton = styled(_Button)`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.deleteButton};
    padding: 8px 24px;
`;

function PictureForm({ user, className }) {
    const buttonRef = useRef();
    return (
        <Row className={className}>
            <ProfilePictureStyled user={user} size="80px" />
            <ChangeablePicture
                user={user}
                css={`
                    margin-right: 8px;
                `}
                button={
                    <Button
                        ref={buttonRef}
                        maxwidth="100%"
                        onClick={e => {
                            e.preventDefault();
                        }}
                    >
                        Upload New Photo
                    </Button>
                }
                buttonRef={buttonRef}
            />

            <DeleteButton>Delete</DeleteButton>
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
