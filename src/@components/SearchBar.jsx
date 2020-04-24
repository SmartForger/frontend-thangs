import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '@svg/search-icon.svg';
import { inputPlaceholderText, bodyCopyText } from '@style/text';

function useSearch(initialSearchQuery = '') {
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const history = useHistory();
    const executeSearch = () => {
        history.push(`/search/${searchQuery}`);
    };
    return { searchQuery, setSearchQuery, executeSearch };
}

const SearchForm = styled.form`
    flex-grow: 1;
    background-color: ${props => props.theme.searchBackground};
    border-radius: 8px;
    margin-left: 12px;
    position: relative;
    display: flex;
    max-width: 1024px;
`;

const SearchStyle = styled.input`
    ${bodyCopyText};
    border: none;
    padding: 9px 0 9px 56px;
    background: none;
    width: 100%;

    ::placeholder {
        ${inputPlaceholderText};
    }
`;

const SearchIconStyled = styled(SearchIcon)`
    position: absolute;
    top: 50%;
    left: 17px;
    transform: translateY(-50%);
`;

export function SearchBar(props) {
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
        <SearchForm onSubmit={handleSubmit}>
            <SearchIconStyled />
            <SearchStyle
                placeholder="Input search term"
                value={searchQuery}
                onChange={handleChange}
            />
        </SearchForm>
    );
}
