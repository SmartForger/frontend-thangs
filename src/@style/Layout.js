import styled from 'styled-components';

const Layout = styled.div`
    max-width: ${props => props.theme.pageWidth};
    margin: ${props => props.theme.headerHeight} auto 0;
`;

export { Layout };
