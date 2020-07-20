import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useForm, ErrorMessage } from 'react-hook-form';

import { formErrorText, infoMessageText } from '../../@style/text';

import { Spinner } from '../Spinner';
import { Button, DarkButton } from '../Button';
import { ProgressText } from '../ProgressText';
import { Uploader } from '../Uploader';
import { UploadFrame } from '../UploadFrame';
import { CategorySelect } from './CategorySelect';

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 32px;
`;

const SaveButton = styled(Button)`
    padding: 8px 36px;
`;

const CancelButton = styled(DarkButton)`
    padding: 8px 36px;
`;

const ErrorStyled = styled.span`
    ${formErrorText};
    margin: 8px 0;
`;
const Row = styled.div`
    display: flex;
`;

const Column = styled.div``;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
`;

const FullWidthInput = styled.input`
    display: block;
    flex-grow: 1;
    border: 0;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
`;

const Label = styled.label`
    margin-bottom: 8px;
`;

const DarkBackgroundSpinner = styled(Spinner)`
    margin-top: 224px;
    & .path {
        stroke: ${props => props.theme.uploaderText};
    }
`;

const DotsStyled = styled(ProgressText)`
    ${infoMessageText};
    width: 139px;
    margin-bottom: 224px;
`;

function ShowError({ message }) {
    return <ErrorStyled>{message}</ErrorStyled>;
}

export function ModelUploadForm({ onSubmit, isUploading, error, onCancel }) {
    const { register, handleSubmit, errors } = useForm();
    const [file, setFile] = useState();
    const [category, setCategory] = useState();

    return (
        <form onSubmit={handleSubmit(onSubmit({ file, category }))}>
            <Row>
                <Column
                    css={`
                        flex-grow: 1;
                        margin-right: 32px;
                    `}
                >
                    {isUploading ? (
                        <UploadFrame>
                            <DarkBackgroundSpinner />
                            <DotsStyled text="Uploading" />
                        </UploadFrame>
                    ) : (
                        <Uploader
                            showError={!!error}
                            file={file}
                            setFile={setFile}
                        />
                    )}
                </Column>
                <Column
                    css={`
                        min-width: 336px;
                    `}
                >
                    <Field>
                        <ErrorMessage
                            errors={errors}
                            name="name"
                            message="Please enter a name for your model"
                        >
                            {ShowError}
                        </ErrorMessage>
                        <Label htmlFor="name">Title *</Label>
                        <FullWidthInput
                            name="name"
                            defaultValue={file && file.name}
                            placeholder="Model Name"
                            ref={register({ required: true })}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="material">Material</Label>
                        <FullWidthInput
                            name="material"
                            placeholder="Material"
                            ref={register}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="weight">Weight</Label>
                        <FullWidthInput
                            name="weight"
                            placeholder="Weight"
                            ref={register}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="height">Height</Label>
                        <FullWidthInput
                            name="height"
                            placeholder="Height"
                            ref={register}
                        />
                    </Field>
                    <Field>
                        <ErrorMessage
                            errors={errors}
                            name="description"
                            message="Please enter a description for your model"
                        >
                            {ShowError}
                        </ErrorMessage>
                        <Label htmlFor="description">Description *</Label>
                        <FullWidthInput
                            name="description"
                            placeholder="Description"
                            ref={register({ required: true })}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="category">Category</Label>
                        <CategorySelect setCategory={setCategory} />
                    </Field>
                </Column>
            </Row>
            <ButtonGroup>
                <CancelButton
                    css={`
                        margin-right: 8px;
                    `}
                    onClick={onCancel}
                    type="button"
                    disabled={isUploading}
                >
                    Cancel
                </CancelButton>
                <SaveButton
                    type="submit"
                    disabled={!file || isUploading || error}
                >
                    Save Model
                </SaveButton>
            </ButtonGroup>
        </form>
    );
}
