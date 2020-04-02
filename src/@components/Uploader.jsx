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

const readFileAsync = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
};

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

        // const modelFormData = new FormData();
        // modelFormData.append('files', draggedfiles);

        // await draggedfiles.forEach(async file => {
        //     // const processedFile = {};
        //     // processedFile.path = file.path;
        //     // processedFile.name = file.name;
        //     // processedFile.type = file.type;
        //     // processedFile.size = file.size;
        //     // processedFile.lastModified = file.lastModified;
        //     // processedFile.lastModifiedDate = file.lastModifiedDate;

        //     // const binary = await readFileAsync(file);

        //     // processedFile['binaryData'] = btoa(
        //     //     new Uint8Array(binary).reduce(
        //     //         (data, byte) => data + String.fromCharCode(byte),
        //     //         ''
        //     //     )
        //     // );
        //     // return processedFile;
        //     modelFormData.append(file);
        // });

        // Promise.all(encodedFiles).then(values => {
        //     axios.post(
        //         // `${process.env.REACT_APP_MODEL_KEY}upload_attachments`,
        //         '/api/upload',
        //         values,
        //         {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //         }
        //     );
        // });

        // axios({
        //     method: 'POST',
        //     url: `${process.env.REACT_APP_MODEL_KEY}upload_attachments`,
        //     data: modelFormData,
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // });
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="customFile">
                    {/* <input
                        type="file"
                        className="file-input"
                        id="custom-file"
                        onChange={onChange}
                    /> */}
                </div>

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
