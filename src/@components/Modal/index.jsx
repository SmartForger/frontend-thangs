import ReactModal from 'react-modal';
import styled from 'styled-components/macro';
import { WHITE_1 } from '../../@style/colors';

ReactModal.setAppElement('#root');

export const Modal = styled(ReactModal)`
    position: fixed;
    padding: 40px 64px 64px;
    background: ${WHITE_1};
    overflow: auto;
    border-radius: 8px;
    outline: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${props => props.theme.shadow};
`;
