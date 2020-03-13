import styled from 'styled-components';

const BasicPageStyle = styled.div`
    max-width: ${props => props.theme.pageWidth};
    height: ${props => props.theme.pageHeight};
    margin: ${props => props.theme.headerHeight} auto 0;
`;

export { BasicPageStyle };
