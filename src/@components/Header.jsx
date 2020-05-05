import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SearchBar } from '@components/SearchBar';
import { ProfilePicture } from '@components/ProfilePicture';
import { useCurrentUser } from '@customHooks/Users';
import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg';
import { ReactComponent as MatchingIcon } from '@svg/matching-icon.svg';
import { ReactComponent as Logo } from '@svg/logo.svg';
import { ReactComponent as LogoText } from '@svg/logo-text.svg';
import { linkText } from '@style/text';
import { Button, BrandButton } from '@components/Button';
import { largerThanMd } from '@style/media-queries';

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

const DesktopBoundary = styled.div`
    margin: 48px auto 16px;
    padding: 0 16px;
    max-width: ${props => props.theme.maxWidth}
    position: relative;
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
    width: 100%;

    ${largerThanMd} {
        margin-left: 32px;
        width: 124px;
    }
`;

function UserPicture({ user }) {
    return (
        <Link to="/profile/">
            <ProfilePicture user={user} size="50px" />
        </Link>
    );
}

function Upload({ css }) {
    return (
        <LinkStyled to={`/upload`} css={css}>
            <UploadButton>Upload Model</UploadButton>
        </LinkStyled>
    );
}
const UserNav = () => {
    const { user } = useCurrentUser();

    if (user) {
        return (
            <Row>
                <UserPicture user={user} />
                <NotificationsButton />
                <Upload />
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

const LinkStyled = styled(Link)`
    ${allowCssProp};
`;

function Matching({ css }) {
    return (
        <LinkStyled to={'/matching'} css={css}>
            <BrandButton
                css={`
                    width: 100%;
                    ${largerThanMd} {
                        padding: 6px 24px 6px 32px;
                    }
                `}
            >
                <MatchingIconStyled />
                Search by Model
            </BrandButton>
        </LinkStyled>
    );
}

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
                {variant !== 'logo-only' && (
                    <Flex>
                        <Matching />
                        <SearchBar />
                    </Flex>
                )}
            </DesktopBoundary>
        </DesktopOnly>
    );
}

const MobileOnly = styled.span`
    ${largerThanMd} {
        display: none;
    }
`;

const DesktopOnly = styled.span`
    display: none;

    ${largerThanMd} {
        display: block;
    }
`;

const MobileBoundary = styled.div`
    margin: 16px auto;
    padding: 0 12px;
`;

function MobileHeader({ variant }) {
    const { user } = useCurrentUser();
    return (
        <MobileOnly>
            <MobileBoundary>
                <TopRow>
                    <Link to="/">
                        <LogoStyled />
                        <LogoText />
                    </Link>
                    {variant !== 'logo-only' && user && (
                        <UserPicture user={user} />
                    )}
                </TopRow>
                {variant !== 'logo-only' && (
                    <>
                        <Row
                            css={`
                                margin-bottom: 16px;
                            `}
                        >
                            <Matching
                                css={`
                                    flex-basis: 50%;
                                    margin-right: 24px;
                                    min-width: 180px;
                                `}
                            />
                            <Upload
                                css={`
                                    flex-basis: 50%;
                                `}
                            />
                        </Row>
                        <SearchBar />
                    </>
                )}
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
