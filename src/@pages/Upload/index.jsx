import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { WithNewThemeLayout } from '@style/Layout';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { Spinner } from '@components/Spinner';

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

const Page = () => {
    const history = useHistory();
    const [file, setFile] = useState();
    const currentUser = authenticationService.currentUserValue;
    const { id } = currentUser;

    const [
        uploadModel,
        { loading: isUploading },
    ] = graphqlService.useUploadModelMutation(id);

    const onSubmit = async e => {
        e.preventDefault();
        await uploadModel({
            variables: {
                file,
                name: sanitizeFileName(file.name),
                size: file.size,
                userEmail: currentUser.email,
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
                <form onSubmit={onSubmit}>
                    <Row>
                        <Column
                            css={`
                                flex-grow: 1;
                                margin-right: 32px;
                            `}
                        >
                            <Uploader file={file} setFile={setFile} />
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
                                    defaultValue={file && file.name}
                                    placeholder="Model Name"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="material">Material</Label>
                                <FullWidthInput
                                    name="material"
                                    placeholder="Material"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="weight">Weight</Label>
                                <FullWidthInput
                                    name="weight"
                                    placeholder="Weight"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="description">Description</Label>
                                <FullWidthInput
                                    name="description"
                                    placeholder="Description"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    name="category"
                                    placeholder="Select Category"
                                    isClearable
                                    options={CATEGORIES}
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
