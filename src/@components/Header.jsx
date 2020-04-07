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

const NOTIFICATIONS_ENABLED = true;
const NOTIFICATIONS_URL = '#';

const allowCssProp = props => (props.css ? props.css : '');

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
    z-index: 1;
`;

const Boundary = styled.div`
    margin: 48px auto 16px;
    padding: 0 16px;
    max-width: 1237px;
    position: relative;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    :not(:last-of-type) {
        margin-bottom: 45px;
    }
`;

const SignIn = styled(Link)`
    color: ${props => props.theme.linkText};
    text-decoration: none;
    font-size: 14px;
    margin-right: 30px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: 500;
`;

const Button = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.primaryButton};
    font-size: 14px;
    padding: 9px 12px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    cursor: pointer;
    font-weight: 500;

    ${props => props.theme.shadow};
    ${allowCssProp};
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

const MatchingButton = styled.button`
    cursor: pointer;

    display: flex;
    align-items: center;
    background-color: ${props => props.theme.brandColor};
    color: ${props => props.theme.textOnBrandColor};
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: 500;
    font-size: 14px;
    padding: 6px 24px 6px 32px;

    ${props => props.theme.shadow};
`;

const MatchingIconStyled = styled(MatchingIcon)`
    margin-right: 8px;
`;

const NotificationIconStyled = styled(NotificationIcon)`
    margin: 0 32px;
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

const UploadButton = () => {
    return (
        <Link to={`/new/upload`}>
            <Button
                css={`
                    width: 124px;
                `}
            >
                Upload Model
            </Button>
        </Link>
    );
};

const UserNav = () => {
    const { user } = useCurrentUser();

    if (user) {
        return (
            <Row>
                <ProfilePicture user={user} size="50px" />
                <NotificationsButton />
                <UploadButton />
            </Row>
        );
    }

    return (
        <div>
            <SignIn to="/login">Sign in</SignIn>
            <SignUp />
        </div>
    );
};

const Header = ({ inverted, variant }) => {
    return (
        <>
            <FixedHeader inverted={inverted}>
                <Boundary>
                    <Row>
                        <div>
                            <Row>
                                <LogoStyled />
                                <LogoText />
                            </Row>
                        </div>
                        {variant !== 'logo-only' && <UserNav />}
                    </Row>
                    {variant !== 'logo-only' && (
                        <Row>
                            <MatchingButton disabled>
                                <MatchingIconStyled />
                                Search by Model
                            </MatchingButton>
                            <SearchBarNew />
                        </Row>
                    )}
                </Boundary>
            </FixedHeader>
        </>
    );
};

export { Header };
