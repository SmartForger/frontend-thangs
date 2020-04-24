import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '@svg/search-icon.svg';

function useSearch(initialSearchQuery = '') {
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const history = useHistory();
    const executeSearch = () => {
        history.push(`/search/${searchQuery}`);
    };
    return { searchQuery, setSearchQuery, executeSearch };
}

const SearchFormNew = styled.form`
    flex-grow: 1;
    background-color: ${props => props.theme.searchBackground};
    border-radius: 8px;
    margin-left: 12px;
    position: relative;
    display: flex;
    max-width: 1024px;
`;

const SearchStyleNew = styled.input`
    color: ${props => props.theme.searchColorIconColor};
    border: none;
    padding: 9px 0 9px 56px;
    background: none;
    width: 100%;
    font-family: ${props => props.theme.buttonFont};
    font-size: 14px;

    ::placeholder {
        color: ${props => props.theme.searchColor};
    }
`;

const SearchIconStyled = styled(SearchIcon)`
    position: absolute;
    top: 50%;
    left: 17px;
    transform: translateY(-50%);
`;

const SearchBarNew = props => {
    const params = useParams();
    const initialSearchQuery = params.searchQuery;
    const { searchQuery, setSearchQuery, executeSearch } = useSearch(
        initialSearchQuery
    );

    const handleChange = e => {
        e.persist();
        setSearchQuery(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        executeSearch();
    };

    return (
        <SearchFormNew onSubmit={handleSubmit}>
            <SearchIconStyled />
            <SearchStyleNew
                placeholder="Input search term"
                value={searchQuery}
                onChange={handleChange}
            />
        </SearchFormNew>
    );
};

export { SearchBarNew };
