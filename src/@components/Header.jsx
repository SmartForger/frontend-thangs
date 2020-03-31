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
    margin: auto;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
        </Boundary>
    );
};

export { Header };
