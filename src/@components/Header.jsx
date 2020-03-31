import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LogoPlaceholder = styled.div`
    height: 23px;
    width: 73px;
    border-radius: 13px;
    background-color: yellow;
    margin-right: 12px;
`;

const Boundary = styled.div`
    max-width: 1237px;
    margin: 50px auto 0;
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

const Search = styled.input`
    flex-grow: 1;
    background-color: ${props => props.theme.searchBackground};
    color: ${props => props.theme.searchColor};
    border: none;
    height: 100%;
    padding: 9px 16px;
    border-radius: 8px;
    margin-left: 12px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;
    font-size: 14px;
`;

const Header = () => {
    return (
        <Boundary>
            <Row>
                <div>
                    <Row>
                        <LogoPlaceholder />
                        <Name>THANGS</Name>
                    </Row>
                </div>
                <div>
                    <SignIn to="/login">Sign in</SignIn>
                    <SignUp />
                </div>
            </Row>
            <Row>
                <MatchingButton disabled>Search by Model</MatchingButton>
                <Search placeholder="Keyword Search" />
            </Row>
        </Boundary>
    );
};

export { Header };
