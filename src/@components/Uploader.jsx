import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { TiUpload } from 'react-icons/ti';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import axios from 'axios';
import styled from 'styled-components';

const StyledUploader = styled.div`
    width: 300px;
    height: 200px;
`;

const StyledUploadBlock = styled.div`
    background: orange;
    height: 300px;
    width: 300px;
    border-radius: 25px;
    transition: all 0.2s;
    color: ${props => (props.dragactive ? 'black' : 'white')};
`;

const FileUpload = () => {
    const [draggedfiles, setDraggedFiles] = useState([]);
    const graphqlService = GraphqlService.getInstance();
    const [uploadModel] = graphqlService.useUploadModelMutation();

    const onDrop = useCallback(acceptedFiles => {
        setDraggedFiles([...draggedfiles, ...acceptedFiles]);
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const onSubmit = async e => {
        e.preventDefault();
        console.log(draggedfiles[0]);
        uploadModel({
            variables: {
                file: draggedfiles[0],
                name: draggedfiles[0].name,
                size: draggedfiles[0].size,
                userEmail: authenticationService.currentUserValue.email,
            },
        });
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <StyledUploadBlock dragactive={isDragActive}>
                        <TiUpload size="300px" />
                    </StyledUploadBlock>
                </div>
                {draggedfiles.length > 0 ? (
                    draggedfiles.map(file => <div>{file.name}</div>)
                ) : (
                    <div>No Files yet</div>
                )}
                <input type="submit" value="Upload" />
            </form>
        </>
    );
};

const Uploader = () => {
    return (
        <StyledUploader>
            <FileUpload />
        </StyledUploader>
    );
};

export { Uploader };
