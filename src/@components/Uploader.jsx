import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from '@svg/upload-icon.svg';

const StyledUploadBlock = styled.div`
    height: 560px;
    border-radius: 8px;
    background-color: ${props =>
        props.dragactive
            ? props.theme.uploaderBackgroundActive
            : props.theme.uploaderBackground};
    color: ${props => props.theme.uploaderText};
    font-size: 24px;
    line-height: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const UploadIconStyled = styled(UploadIcon)`
    margin-bottom: 32px;
`;

const LinkColor = styled.span`
    color: ${props => props.theme.linkText};
`;
export function Uploader({ file, setFile }) {
    const onDrop = useCallback(
        acceptedFiles => {
            setFile(acceptedFiles[0]);
        },
        [setFile],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    return (
        <div {...getRootProps()}>
            <input {...getInputProps({ multiple: false })} />
            <StyledUploadBlock dragactive={isDragActive}>
                {file ? (
                    <div>File: {file.name}</div>
                ) : (
                    <>
                        <UploadIconStyled />
                        <div>Drag & Drop model</div>
                        <div>
                            or <LinkColor>browse</LinkColor> to choose file
                        </div>
                    </>
                )}
            </StyledUploadBlock>
        </div>
    );
}
