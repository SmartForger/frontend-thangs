import React from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style/Layout';
import { Uploader } from '@components/Uploader';

const Header = styled.h1`
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.headerColor};
`;

const Page = () => {
    return (
        <div>
            <Header>Upload Model</Header>
            <Uploader />
        </div>
    );
};

const Upload = WithNewThemeLayout(Page);

export { Upload };
