import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import styled from 'styled-components';

const StyledUploadBlock = styled.div`
    height: 300px;
    width: 300px;
    border-radius: 25px;
    color: ${props => (props.dragactive ? 'black' : 'white')};
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
                <StyledUploadBlock dragactive={isDragActive} />
            </div>
            {draggedFile && <div>{draggedFile.name}</div>}
            <input type="submit" value="Upload" />
        </form>
    );
}

export { Uploader };
