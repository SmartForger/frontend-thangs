import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from '@svg/upload-icon.svg';
import { UploadFrame } from '@components/UploadFrame';

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
            <UploadFrame dragactive={isDragActive}>
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
            </UploadFrame>
        </div>
    );
}
