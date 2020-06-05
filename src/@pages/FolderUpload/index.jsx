import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useForm, ErrorMessage } from 'react-hook-form';
import { WithNewThemeLayout } from '@style/Layout';
import { Message404 } from '../404';
import { useFolder } from '../../@customHooks/Folders';
import { Uploader } from '@components/Uploader';
import { Button, DarkButton } from '@components/Button';
import { FlashContext } from '../../@components/Flash';
import { Breadcrumbs } from '../../@components/Breadcrumbs';
import { useAddToFolder } from '../../@customHooks/Folders';
import { Spinner } from '@components/Spinner';
import { UploadFrame } from '@components/UploadFrame';
import { ProgressText } from '@components/ProgressText';
import { formErrorText, infoMessageText } from '@style/text';

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

const DotsStyled = styled(ProgressText)`
    ${infoMessageText};
    width: 139px;
    margin-bottom: 224px;
`;

const BreadcrumbsStyled = styled(Breadcrumbs)`
    margin-bottom: 48px;
`;

function Upload({ folder }) {
    const history = useHistory();
    const [file, setFile] = useState();
    const [category, setCategory] = useState();
    const [
        addToFolder,
        { loading: isUploading, error: uploadError },
    ] = useAddToFolder(folder.id);
    const [, { navigateWithFlash }] = useContext(FlashContext);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = async data => {
        const requiredVariables = {
            folderId: folder.id,
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

        await addToFolder(file, {
            variables: {
                ...requiredVariables,
                ...optionalVariables,
            },
        });

        navigateWithFlash('/home', 'Model added successfully.');
    };

    const handleCancel = e => {
        e.preventDefault();
        history.goBack();
    };

    const modelsCount = folder.models ? folder.models.length : 0;

    return (
        <div>
            <BreadcrumbsStyled
                modelsCount={modelsCount}
                folder={folder}
            ></BreadcrumbsStyled>
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
                            <Uploader
                                showError={!!uploadError}
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
                            <Select
                                name="category"
                                placeholder="Select Category"
                                isClearable
                                options={CATEGORIES}
                                onChange={({ value }) => setCategory(value)}
                                components={{
                                    IndicatorSeparator: () => null,
                                    DropdownIndicator: ({ cx, ...props }) => {
                                        // cx causes React to throw an error, so we remove it
                                        return <DropdownIndicator {...props} />;
                                    },
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
                    <SaveButton type="submit" disabled={!file}>
                        Save Model
                    </SaveButton>
                </ButtonGroup>
            </form>
        </div>
    );
}
const Page = () => {
    console.log('FolderUpload');
    const { folderId } = useParams();
    const { loading, error, folder } = useFolder(folderId);

    if (loading) {
        return <Spinner />;
    } else if (!folder) {
        return <Message404 />;
    } else if (error) {
        return <div>Error loading folder</div>;
    }
    return <Upload folder={folder} />;
};

const FolderUpload = WithNewThemeLayout(Page, { logoOnly: true });

export { FolderUpload };
