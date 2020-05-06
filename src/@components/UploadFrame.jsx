import styled from 'styled-components';

const allowCssProp = props => (props.css ? props.css : '');

export const UploadFrame = styled.div`
    height: 560px;
    background-color: ${props =>
        props.dragactive
            ? props.theme.uploaderBackgroundActive
            : props.theme.uploaderBackground};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    cursor: ${props => (props.currentFile ? 'autor' : 'pointer')};

    ${allowCssProp};
`;
