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

const Row = styled.div`
    display: flex;
`;

const allowCssProp = props => (props.css ? props.css : '');

const Column = styled.div`
    ${allowCssProp};
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
`;

const FullWidthInput = styled.input`
    display: block;
    flex-grow: 1;
    border: 0;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;

    ${allowCssProp};
`;

const Label = styled.label`
    margin-bottom: 8px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 32px;
`;

const Button = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.primaryButton};
    font-size: 14px;
    padding: 8px 36px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: 500;
    cursor: pointer;

    ${props => props.theme.shadow};
    ${allowCssProp};
`;

const CancelButton = styled(Button)`
    background-color: ${props => props.theme.deleteButton};
`;

function Uploader() {
    const [draggedFile, setDraggedFile] = useState();
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
            <Row>
                <Column
                    css={`
                        flex-grow: 1;
                        margin-right: 32px;
                    `}
                >
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <StyledUploadBlock dragactive={isDragActive}>
                            {draggedFile ? (
                                <div>File: {draggedFile.name}</div>
                            ) : (
                                <>
                                    <UploadIconStyled />
                                    <div>Drag & Drop model</div>
                                    <div>
                                        or <LinkColor>browse</LinkColor> to
                                        choose file
                                    </div>
                                </>
                            )}
                        </StyledUploadBlock>
                    </div>
                </Column>
                <Column
                    css={`
                        min-width: 336px;
                    `}
                >
                    <Field>
                        <Label htmlFor="name">Title</Label>
                        <FullWidthInput
                            name="name"
                            defaultValue={draggedFile && draggedFile.name}
                            placeholder="Model Name"
                        />
                    </Field>
                </Column>
            </Row>
            <ButtonGroup>
                <CancelButton
                    css={`
                        margin-right: 8px;
                    `}
                >
                    Cancel
                </CancelButton>
                <Button type="submit">Save Model</Button>
            </ButtonGroup>
        </form>
    );
}

export { Uploader };
