import React from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style';

const Header = styled.h1`
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.headerColor};
`;
const Page = () => {
    return (
        <div>
            <Header>Upload Model</Header>
        </div>
    );
};

const Upload = WithNewThemeLayout(Page);

export { Upload };
