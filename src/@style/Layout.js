import styled, { css } from 'styled-components';
import React from 'react';
import { ThangsHeader } from '@components/ThangsHeader';

const frame = fullScreen => {
    return fullScreen
        ? css`
              padding-right: 32px;
              padding-left: 32px;
          `
        : css`
              max-width: ${props => props.theme.pageWidth};
          `;
};

const Layout = styled.div`
    ${props => frame(props.fullScreen)};
    margin: ${props => props.theme.headerHeight} auto 0;
`;

const Content = styled.div`
    width: 100%;
    padding-top: 15px;
`;

const WithLayout = Component => props => {
    return (
        <>
            <ThangsHeader />
            <Layout>
                <Content>
                    <Component {...props} />
                </Content>
            </Layout>
        </>
    );
};

const WithFullScreenLayout = Component => props => {
    return (
        <>
            <ThangsHeader />
            <Layout fullScreen>
                <Content>
                    <Component {...props} />
                </Content>
            </Layout>
        </>
    );
};
export { WithLayout, WithFullScreenLayout };
