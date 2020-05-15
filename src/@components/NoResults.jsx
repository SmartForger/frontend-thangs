import styled from 'styled-components';
import { zeroStateText } from '@style/text';

export const NoResults = styled.div`
    ${zeroStateText};
    background-color: ${props => props.theme.zeroStateBackground};
    padding: 16px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
`;
