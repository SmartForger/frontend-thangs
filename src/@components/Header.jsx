import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SearchBarNew } from '@components/SearchBar';
import { ProfilePicture } from '@components/ProfilePicture';
import { useCurrentUser } from '@customHooks/Users';

const LogoPlaceholder = styled.div`
    height: 23px;
    width: 73px;
    border-radius: 13px;
    background-color: yellow;
    margin-right: 12px;
`;

const FixedHeader = styled.div`
    width: 100%;
    position: fixed;
    background: ${props => props.theme.backgroundColor};
    top: 0;
`;

const Boundary = styled.div`
    margin: 50px auto 0;
    max-width: 1237px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    :not(:last-of-type) {
        margin-bottom: 45px;
    }
`;

const Name = styled.div`
    color: ${props => props.theme.logoText};
    font-family: ${props => props.theme.mainFont};
    font-size: 20px;
`;

const SignIn = styled(Link)`
    color: ${props => props.theme.linkText};
    text-decoration: none;
    font-size: 14px;
    margin-right: 30px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;
`;

const Button = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.primaryButton};
    font-size: 14px;
    padding: 9px 12px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;

    ${props => props.theme.shadow};
`;

const TextBox = styled.div`
    width: 81px;
`;

const SignUp = () => {
    return (
        <Link to="/signup">
            <Button>
                <TextBox>Sign up</TextBox>
            </Button>
        </Link>
    );
};

const MatchingButton = styled.button`
    background-color: ${props => props.theme.brandColor};
    color: ${props => props.theme.textOnBrandColor};
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;
    font-size: 14px;
    padding: 9px 24px;

    ${props => props.theme.shadow};
`;

const UserNav = () => {
    const { user } = useCurrentUser();

    if (user) {
        return (
            <div>
                <ProfilePicture user={user} size="50px" />
            </div>
        );
    }

    return (
        <div>
            <SignIn to="/login">Sign in</SignIn>
            <SignUp />
        </div>
    );
};

const Header = () => {
    return (
        <FixedHeader>
            <Boundary>
                <Row>
                    <div>
                        <Row>
                            <LogoPlaceholder />
                            <Name>THANGS</Name>
                        </Row>
                    </div>
                    <UserNav />
                </Row>
                <Row>
                    <MatchingButton disabled>Search by Model</MatchingButton>
                    <SearchBarNew />
                </Row>
            </Boundary>
        </FixedHeader>
    );
};

export { Header };
