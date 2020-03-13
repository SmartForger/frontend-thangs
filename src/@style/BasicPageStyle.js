import styled from 'styled-components';

const BasicPageStyle = styled.div`
    max-width: ${props => props.theme.pageWidth};
    height: ${props => props.theme.pageHeight};
    margin: auto;
`;

export { BasicPageStyle };
