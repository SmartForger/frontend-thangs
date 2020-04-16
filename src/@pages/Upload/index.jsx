import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { useForm, ErrorMessage } from 'react-hook-form';
import { WithNewThemeLayout } from '@style/Layout';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { Spinner } from '@components/Spinner';
import { UploadFrame } from '@components/UploadFrame';
import { Dots } from '@components/UploadProgress';

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
    margin-bottom: 8px;
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

    :disabled {
        cursor: not-allowed;
    }

    ${props => props.theme.shadow};
    ${allowCssProp};
`;

const CancelButton = styled(Button)`
    background-color: ${props => props.theme.deleteButton};
`;

const Header = styled.h1`
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.headerColor};
    margin-bottom: 24px;
`;

const ErrorStyled = styled.span`
    margin: 8px 0;
    color: ${props => props.theme.errorTextColor};
    font-weight: 500;
`;

const graphqlService = GraphqlService.getInstance();

const sanitizeFileName = name => name.replace(/ /g, '_');

const CATEGORIES = [
    { value: 'automotive', label: 'Automotive' },
    { value: 'aerospace', label: 'Aerospace' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'home', label: 'Home' },
    { value: 'safety', label: 'Safety' },
    { value: 'characters', label: 'Characters' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'technology', label: 'Technology' },
    { value: 'hobbyist', label: 'Hobbyist' },
];

const DropdownIndicator = styled.div`
    width: 0;
    height: 0;
    margin-right: 16px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;

    /* We unfortunately need to hardcode this value because of how react-select works */
    border-top: 8px solid #f5f5f5;
`;

function ShowError({ message }) {
    return <ErrorStyled>{message}</ErrorStyled>;
}

const DarkBackgroundSpinner = styled(Spinner)`
    margin-top: 224px;
    & .path {
        stroke: ${props => props.theme.uploaderText};
    }
`;

const DotsStyled = styled(Dots)`
    width: 139px;
    margin-bottom: 224px;
`;

const Page = () => {
    const history = useHistory();
    const [file, setFile] = useState();
    const [category, setCategory] = useState();
    const currentUser = authenticationService.currentUserValue;
    const { id } = currentUser;

    const [
        uploadModel,
        { loading: isUploading },
    ] = graphqlService.useUploadModelMutation(id);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = async data => {
        const requiredVariables = {
            file,
            name: sanitizeFileName(data.name),
            size: file.size,
            description: data.description,
        };

        const optionalVariables = {
            weight: data.weight,
            height: data.height,
            material: data.material,
            category,
        };

        await uploadModel({
            variables: {
                ...requiredVariables,
                ...optionalVariables,
            },
        });
        history.push('/profile');
    };

    const handleCancel = e => {
        e.preventDefault();
        history.goBack();
    };

    return (
        <div>
            <Header>Upload Model</Header>
            {isUploading ? (
                <Spinner />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                <Uploader file={file} setFile={setFile} />
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
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <FullWidthInput
                                    name="description"
                                    placeholder="Description"
                                    ref={register({ required: true })}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    name="category"
                                    placeholder="Select Category"
                                    isClearable
                                    options={CATEGORIES}
                                    onChange={({ value }) => setCategory(value)}
                                    components={{
                                        IndicatorSeparator: () => null,
                                        DropdownIndicator,
                                    }}
                                    styles={{
                                        control: base => {
                                            return {
                                                ...base,
                                                minHeight: 'auto',
                                                borderRadius: '8px',
                                                backgroundColor: '#616168',
                                                border: 'none',
                                            };
                                        },
                                        singleValue: base => {
                                            return {
                                                ...base,
                                                margin: 0,
                                                color: '#f5f5f5',
                                            };
                                        },
                                        placeholder: base => {
                                            return {
                                                ...base,
                                                margin: 0,
                                                color: '#f5f5f5',
                                            };
                                        },
                                        clearIndicator: base => {
                                            return {
                                                ...base,
                                                color: '#f5f5f5',
                                                padding: '7px',
                                            };
                                        },
                                        input: base => {
                                            return {
                                                ...base,
                                                margin: 0,
                                                padding: 0,
                                            };
                                        },
                                        valueContainer: base => {
                                            return {
                                                ...base,
                                                padding: '8px 16px',
                                            };
                                        },
                                    }}
                                />
                            </Field>
                        </Column>
                    </Row>
                    <ButtonGroup>
                        <CancelButton
                            css={`
                                margin-right: 8px;
                            `}
                            onClick={handleCancel}
                            type="button"
                        >
                            Cancel
                        </CancelButton>
                        <Button type="submit" disabled={!file}>
                            Save Model
                        </Button>
                    </ButtonGroup>
                </form>
            )}
        </div>
    );
};

const Upload = WithNewThemeLayout(Page, { logoOnly: true });

export { Upload };
