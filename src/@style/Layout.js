import styled, { css } from 'styled-components';
import React from 'react';

const frame = fullScreen => {
    return fullScreen
        ? css`
              padding-right: 32px;
              padding-left: 32px;
              height: 100vh;
          `
        : css`
              max-width: ${props => props.theme.pageWidth};
          `;
};

const Layout = styled.div`
    ${props => frame(props.fullScreen)};
    margin: ${props => props.theme.headerHeight} auto 0;
    display: flex;
`;

const Content = styled.div`
    width: 100%;
    padding-top: 15px;
`;

const WithLayout = Component => props => {
    return (
        <Layout>
            <Content>
                <Component {...props} />
            </Content>
        </Layout>
    );
};

const WithFullScreenLayout = ({ children }) => {
    return (
        <Layout fullScreen>
            <Content>{children}</Content>
        </Layout>
    );
};
export { WithLayout, WithFullScreenLayout };
