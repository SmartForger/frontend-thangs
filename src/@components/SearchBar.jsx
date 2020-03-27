import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const SearchForm = styled.form`
    width: 50%;
    height: 100%;
    display: flex;
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

function useSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const history = useHistory();
    const executeSearch = () => {
        history.replace(`/search/${searchQuery}`);
    };
    return { searchQuery, setSearchQuery, executeSearch };
}

const SearchBar = props => {
    const { searchQuery, setSearchQuery, executeSearch } = useSearch();

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
            <SearchStyle
                placeholder="Input search term"
                value={searchQuery}
                onChange={handleChange}
            />
        </SearchForm>
    );
};

export { SearchBar };
