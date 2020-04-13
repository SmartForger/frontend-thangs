import styled from 'styled-components';

export const AnchorButton = styled.button`
    margin: 0;
    padding: 0;
    border: none;
    color: ${props => props.theme.linkText};
    background: none;
    text-decoration: none;
    cursor: pointer;
`;
