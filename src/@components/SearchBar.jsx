import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '@svg/search-icon.svg';
import { inputPlaceholderText } from '@style/text';
import { largerThanMd } from '@style/media-queries';

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
    position: relative;
    display: flex;
    max-width: 1024px;

    ${largerThanMd} {
        margin-left: 12px;
    }
`;

const SearchStyle = styled.input`
    border: none;
    padding: 8px 8px 8px 40px;
    background: none;
    width: 100%;

    ::placeholder {
        ${inputPlaceholderText};
    }

    ${largerThanMd} {
        padding-left: 56px;
    }
`;

const SearchIconStyled = styled(SearchIcon)`
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    height: 18px;
    width: 18px;

    ${largerThanMd} {
        height: 24px;
        width: 24px;
    }
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
                placeholder="Search models by name, description, owner, etc..."
                value={searchQuery}
                onChange={handleChange}
            />
        </SearchForm>
    );
}
