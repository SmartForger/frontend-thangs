import styled from 'styled-components/macro';
import { WHITE_1, WHITE_5 } from '../@style/colors';

export const UploadFrame = styled.div`
    height: 560px;
    background-color: ${props => (props.dragactive ? WHITE_5 : WHITE_1)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    cursor: ${props => (props.currentFile ? 'auto' : 'pointer')};
`;
