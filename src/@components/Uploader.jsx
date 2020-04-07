import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
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

function Uploader() {
    const [draggedFile, setDraggedFile] = useState([]);
    const graphqlService = GraphqlService.getInstance();
    const [uploadModel] = graphqlService.useUploadModelMutation();

    const onDrop = useCallback(
        acceptedFiles => {
            setDraggedFile(acceptedFiles[0]);
        },
        [setDraggedFile],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const onSubmit = async e => {
        e.preventDefault();
        uploadModel({
            variables: {
                file: draggedFile,
                name: draggedFile.name,
                size: draggedFile.size,
                userEmail: authenticationService.currentUserValue.email,
            },
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <StyledUploadBlock dragactive={isDragActive}>
                    <UploadIconStyled />
                    <div>Drag & Drop model</div>
                    <div>
                        or <LinkColor>browse</LinkColor> to choose file
                    </div>
                </StyledUploadBlock>
            </div>
            {draggedFile && <div>{draggedFile.name}</div>}
            <input type="submit" value="Upload" />
        </form>
    );
}

export { Uploader };
