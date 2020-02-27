import styled from 'styled-components';

const BasicPageStyle = styled.div`
    width: ${props => props.theme.pageWidth};
    height: ${props => props.theme.pageHeight};
    top: ${props => props.theme.pageTop};
    left: ${props => props.theme.pageLeft};
    margin-left: ${props => props.theme.pageMarginLeft};
`;

export { BasicPageStyle };
