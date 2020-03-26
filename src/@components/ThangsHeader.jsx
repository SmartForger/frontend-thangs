import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { authenticationService } from '@services';
import { Shelf, ShelfButton, Button, SVG } from '@components';

const HeaderStyle = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: ${props => props.theme.headerHeight};
    background: ${props => props.theme.white};
    z-index: 10;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
`;

const LogoLink = styled(Link)`
    margin-left: 160px;
    width: 200px;
    height: 100%;
`;

const SvgContainer = styled.div`
    position: relative;
    height: 100%;
    color: ${props => props.theme.secondary};
    font-size: 5px;
    font-family: ${props => props.theme.mainFont};

    & > svg {
        position: absolute;
        color: ${props => props.theme.primary};
        top: -60px;
    }
`;

const SearchStyle = styled.input`
    border: 0.5px solid ${props => props.theme.darkgrey};
    padding: 0 15px;
    background: ${props => props.theme.grey};
    width: 100%;
    font-size: 30px;

    ::placeholder {
        color: ${props => props.theme.darkgrey};
    }
`;
const ProfileStyle = styled.div`
    width: 17vw;
    height: 100%;
    background: ${props => props.theme.grey};
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
`;

const SearchForm = styled.form`
    width: 50%;
    height: 100%;
    display: flex;
`;

const ThangsHeader = () => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchterm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        authenticationService.currentUser.subscribe(x => setCurrentUser(x));
    });

    const logout = () => {
        authenticationService.logout();
        history.push('/login');
    };

    const handleChange = e => {
        e.persist();
        setSearchterm(e.target.value);
    };

    const performSearch = e => {
        alert(searchTerm);
        setSearchterm('');
        if (e) {
            e.preventDefault();
        }
    };

    return (
        <>
            <HeaderStyle>
                <LogoLink to="/">
                    <SvgContainer>
                        <SVG />
                    </SvgContainer>
                </LogoLink>
                <SearchForm onSubmit={performSearch}>
                    <SearchStyle
                        placeholder="Input search term"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                </SearchForm>
                <ProfileStyle>
                    <ShelfButton open={open} setOpen={setOpen} />
                    {currentUser ? (
                        <Button onClick={logout} name="Logout" />
                    ) : (
                        <Button routeto="/login" name="Login" />
                    )}
                </ProfileStyle>
            </HeaderStyle>
            <Shelf open={open} setOpen={setOpen}>
                <h1>Yo</h1>
                <h1>Yo</h1>
                <h1>Yo</h1>
                <h1>Yo</h1>
                <h1>Yo</h1>
                <h1>Yo</h1>
            </Shelf>
        </>
    );
};
export { ThangsHeader };
