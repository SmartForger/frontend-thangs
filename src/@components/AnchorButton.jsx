import styled from 'styled-components';
import { linkText } from '@style/text';

const allowCssProp = props => (props.css ? props.css : '');

export const AnchorButton = styled.button`
    ${linkText};
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;

    ${allowCssProp};
`;
