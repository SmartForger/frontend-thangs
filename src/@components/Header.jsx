import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SearchBarNew } from '@components/SearchBar';
import { ProfilePicture } from '@components/ProfilePicture';
import { useCurrentUser } from '@customHooks/Users';
import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg';
import { ReactComponent as MatchingIcon } from '@svg/matching-icon.svg';
import { ReactComponent as Logo } from '@svg/logo.svg';
import { ReactComponent as LogoText } from '@svg/logo-text.svg';
import { usernameLinkText } from '@style/text';
import { Button } from '@components/Button';

const NOTIFICATIONS_ENABLED = false;
const NOTIFICATIONS_URL = '#';

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

const Boundary = styled.div`
    margin: 48px auto 16px;
    max-width: ${props => props.theme.maxWidth}
    position: relative;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    :not(:last-of-type) {
        margin-bottom: 25px;
    }
`;

const TopRow = styled(Row)`
    height: 50px;
`;

const SignIn = styled(Link)`
    ${usernameLinkText};
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

const MatchingButton = styled(Button)`
    background-color: ${props => props.theme.brandColor};
    color: ${props => props.theme.textOnBrandColor};
    padding: 6px 24px 6px 32px;
`;

const MatchingIconStyled = styled(MatchingIcon)`
    margin-right: 8px;
`;

const NotificationIconStyled = styled(NotificationIcon)`
    margin-left: 32px;
`;

const NotificationsButton = () => {
    if (!NOTIFICATIONS_ENABLED) {
        return null;
    }
    return (
        <Link to={NOTIFICATIONS_URL}>
            <NotificationIconStyled />
        </Link>
    );
};

const UploadButton = styled(Button)`
    width: 124px;
    margin-left: 32px;
`;

const UserNav = () => {
    const { user } = useCurrentUser();

    if (user) {
        return (
            <Row>
                <Link to="/profile/">
                    <ProfilePicture user={user} size="50px" />
                </Link>
                <NotificationsButton />
                <Link to={`/upload`}>
                    <UploadButton>Upload Model</UploadButton>
                </Link>
            </Row>
        );
    }

    return (
        <Row>
            <SignIn to="/login">Sign in</SignIn>
            <SignUp />
        </Row>
    );
};

const Flex = styled.div`
    display: flex;
`;

const Header = ({ inverted, variant }) => {
    return (
        <>
            <FixedHeader inverted={inverted}>
                <Boundary>
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
                    {variant !== 'logo-only' && (
                        <Flex>
                            <Link to={'/matching'}>
                                <MatchingButton>
                                    <MatchingIconStyled />
                                    Search by Model
                                </MatchingButton>
                            </Link>
                            <SearchBarNew />
                        </Flex>
                    )}
                </Boundary>
            </FixedHeader>
        </>
    );
};

export { Header };
