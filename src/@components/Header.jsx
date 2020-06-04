import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useParams, useHistory, Link } from 'react-router-dom';
import { ProfilePicture } from '@components/ProfilePicture';
import { useCurrentUser } from '@customHooks/Users';
import { useHasUnreadNotifications } from '@customHooks/Notifications';
import { DropdownMenu, DropdownItem } from '@components/DropdownMenu';
import { FolderCreateModal } from '@components/FolderCreateModal';
import { linkText } from '@style/text';
import { Button } from '@components/Button';
import { mediaMdPlus } from '@style/media-queries';
import { GREY_5, RED_2 } from '@style/colors';

import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg';
import { ReactComponent as Logo } from '@svg/logo.svg';
import { ReactComponent as LogoText } from '@svg/logo-text.svg';
import { ReactComponent as PlusButton } from '@svg/icon-blue-circle-plus.svg';
import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass.svg';
import { ReactComponent as UploadModelToFolderIcon } from '@svg/upload-model-to-folder-icon.svg';
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg';
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg';
import { ReactComponent as HeartIcon } from '@svg/heart-icon-gray.svg';
import { ReactComponent as PencilIcon } from '@svg/icon-pencil.svg';
import { ReactComponent as UserPlusIcon } from '@svg/icon-user-plus.svg';

const NOTIFICATIONS_URL = '/notifications';

const LogoStyled = styled(Logo)`
    margin-right: 12px;
`;

const FixedHeader = styled.div`
    width: 100%;
    position: fixed;
    background: ${props =>
        props.inverted
            ? props.theme.invertedHeaderBackground
            : props.theme.backgroundColor};
    top: 0;
    z-index: 2;
`;

const DesktopBoundary = styled.div`
    position: relative;
    margin: 48px auto 16px;
    max-width: ${props => props.theme.maxWidth};
    flex-grow: 1;

    ${mediaMdPlus} {
        margin: 48px 100px 16px;
    }
`;

const allowCssProp = props => (props.css ? props.css : '');

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    :not(:last-of-type) {
        margin-bottom: 24px;
    }

    ${allowCssProp};
`;

const TopRow = styled(Row)`
    height: 50px;
`;

const SignIn = styled(Link)`
    ${linkText};
    margin-right: 30px;
`;

const SignUp = () => {
    return (
        <Link to="/signup">
            <Button
                css={`
                    width: 81px;
                `}
            >
                Sign up
            </Button>
        </Link>
    );
};

const NotificationIconStyled = styled(NotificationIcon)`
    color: ${props => (props.unread ? RED_2 : GREY_5)};
`;

const NotificationsButton = () => {
    const { hasUnreadNotifications } = useHasUnreadNotifications();

    return (
        <Link
            to={NOTIFICATIONS_URL}
            css={`
                height: 50px;
                padding: 0 8px;
            `}
        >
            <NotificationIconStyled unread={hasUnreadNotifications ? 1 : 0} />
        </Link>
    );
};

const DropdownIcon = styled(PlusButton)``;
const SearchIcon = styled(MagnifyingGlass)``;
const ProfilePictureStyled = styled(ProfilePicture)``;
function Search() {
    return (
        <Link
            to="/search"
            css={`
                height: 50px;
                padding: 0 8px;
            `}
        >
            <SearchIcon />
        </Link>
    );
}
function UserPicture({ user }) {
    return (
        <Link to="/profile/">
            <ProfilePictureStyled
                name={user.fullName}
                src={user.profile.avatarUrl}
                size="50px"
            />
        </Link>
    );
}

const ButtonsRow = styled(Row)`
    > a {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 8px;
        :last-child {
            margin-right: 0px;
        }
    }
`;

const DropdownMenuStyled = styled(DropdownMenu)`
    height: 50px;
    margin: auto;
    > button {
        height: 50px;
    }
`;

const DropdownIconStyled = styled(DropdownIcon)`
    width: 50px;
    height: 50px;
`;

function AddModelDropdownMenu() {
    const { folderId } = useParams();
    const history = useHistory();
    const [createFolderIsOpen, setCreateFolderIsOpen] = useState(false);
    return (
        <>
            <DropdownMenuStyled
                css={`
                    margin: 0 8px;
                    width: 50px;
                    line-height: 0;
                    > div {
                        right: 0px;
                    }
                `}
                buttonIcon={DropdownIconStyled}
            >
                {folderId && (
                    <DropdownItem to={`/folder/${folderId}/upload`}>
                        <UploadModelToFolderIcon /> Upload model to folder
                    </DropdownItem>
                )}
                <DropdownItem to="/upload">
                    <ModelSquareIcon /> Upload model
                </DropdownItem>
                <DropdownItem
                    to="/"
                    onClick={() => setCreateFolderIsOpen(true)}
                >
                    <NewFolderIcon />
                    Add Folder
                </DropdownItem>
            </DropdownMenuStyled>
            <FolderCreateModal
                isOpen={createFolderIsOpen}
                onCancel={() => setCreateFolderIsOpen(false)}
                afterCreate={folder => {
                    history.push(`/folder/${folder.id}`);
                }}
            />
        </>
    );
}

function ProfileDropdownMenu() {
    const { folderId } = useParams();
    return (
        <DropdownMenuStyled>
            {folderId !== undefined && (
                <DropdownItem to="/">
                    <UserPlusIcon /> Invite users
                </DropdownItem>
            )}
            <DropdownItem to="/profile/edit">
                <PencilIcon /> Edit Profile
            </DropdownItem>
            <DropdownItem to="/profile/likes">
                <HeartIcon /> Liked Models
            </DropdownItem>
        </DropdownMenuStyled>
    );
}

const UserNav = () => {
    const { loading, user } = useCurrentUser();

    if (loading) {
        return <Row></Row>;
    }

    if (user) {
        return (
            <ButtonsRow>
                <Search />
                <NotificationsButton />
                <AddModelDropdownMenu />
                <UserPicture user={user} />
                <ProfileDropdownMenu />
            </ButtonsRow>
        );
    }

    return (
        <Row>
            <SignIn to="/login">Sign in</SignIn>
            <SignUp />
        </Row>
    );
};

function DesktopHeader({ variant }) {
    return (
        <DesktopOnly>
            <DesktopBoundary>
                <TopRow>
                    <div>
                        <Row>
                            <Link to="/">
                                <LogoStyled />
                                <LogoText />
                            </Link>
                        </Row>
                    </div>
                    {variant !== 'logo-only' && <UserNav />}
                </TopRow>
            </DesktopBoundary>
        </DesktopOnly>
    );
}

const MobileOnly = styled.span`
    ${mediaMdPlus} {
        display: none;
    }
`;

const DesktopOnly = styled.span`
    display: none;

    ${mediaMdPlus} {
        display: flex;
        justify-content: center;
    }
`;

const MobileBoundary = styled.div`
    margin: 44px 0px auto;
    padding: 0 12px;
`;

function MobileHeader({ variant }) {
    return (
        <MobileOnly>
            <MobileBoundary>
                <TopRow>
                    <Link to="/">
                        <LogoStyled />
                    </Link>
                    {variant !== 'logo-only' && <UserNav />}
                </TopRow>
            </MobileBoundary>
        </MobileOnly>
    );
}

const Header = ({ inverted, variant }) => {
    return (
        <>
            <FixedHeader inverted={inverted}>
                <MobileHeader variant={variant} />
                <DesktopHeader variant={variant} />
            </FixedHeader>
        </>
    );
};

export { Header };
