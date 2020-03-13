import styled from 'styled-components';
import React from 'react';

const Layout = styled.div`
    max-width: ${props => props.theme.pageWidth};
    margin: ${props => props.theme.headerHeight} auto 0;
    display: flex;
`;

const Content = styled.div`
    width: 100%;
    padding-top: 15px;
`;

const WithLayout = ({ children }) => {
    return (
        <Layout>
            <Content>{children}</Content>
        </Layout>
    );
};

export { WithLayout };
