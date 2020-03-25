import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { TiUpload } from 'react-icons/ti';
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

    const onDrop = useCallback(acceptedFiles => {
        setDraggedFiles([...draggedfiles, ...acceptedFiles]);
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const onSubmit = async e => {
        e.preventDefault();

        const encodedFiles = await draggedfiles.map(async file => {
            const processedFile = {};
            processedFile.path = file.path;
            processedFile.name = file.name;
            processedFile.type = file.type;
            processedFile.size = file.size;
            processedFile.lastModified = file.lastModified;
            processedFile.lastModifiedDate = file.lastModifiedDate;

            const binary = await readFileAsync(file);

            processedFile['binaryData'] = btoa(
                new Uint8Array(binary).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            return processedFile;
        });

        Promise.all(encodedFiles).then(values => {
            axios.post('http://localhost:5000/upload_attachments', values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
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
