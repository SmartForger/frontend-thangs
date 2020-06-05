import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { WithNewThemeLayout } from '@style/Layout';
import { Button } from '@components/Button';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { CardCollection } from '@components/CardCollection';
import { UploadProgress } from '@components/UploadProgress';

import { subheaderText, matchingSubheader } from '@style/text';

const PROCESSING = 'PROCESSING';
const ERROR = 'ERROR';

const Header = styled.h1`
    ${subheaderText};
    margin-bottom: 16px;
`;

const Subheader = styled.h4`
    ${matchingSubheader};
    margin-bottom: 24px;
`;

const graphqlService = GraphqlService.getInstance();

const CancelButton = styled(Button)`
    background-color: ${props => props.theme.deleteButton};
    margin-top: 24px;
    float: right;
`;

function Results({ modelId }) {
    const {
        loading,
        error,
        model,
        startPolling,
        stopPolling,
    } = graphqlService.useUploadedModelByIdWithRelated(modelId);

    if (loading || (model && model.uploadStatus === PROCESSING)) {
        startPolling(1000);
        return <UploadProgress />;
    }

    stopPolling();

    if (error || !model || model.uploadStatus === ERROR) {
        return (
            <div>
                There was an error analyzing your model. Please try again later.
            </div>
        );
    }

    return (
        <CardCollection
            models={model.relatedModels}
            noResultsText="No geometric similar matches found. Try uploading another model."
        />
    );
}

function Page() {
    const [currentModel, setCurrentModel] = useState();
    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();
    const [
        uploadModel,
        { loading: isUploading, error: uploadError },
    ] = graphqlService.useUploadModelMutation(currentUser.id);

    async function handleFile(file) {
        const model = await uploadModel(file, {
            variables: {
                name: file.name,
                size: file.size,
                userEmail: currentUser.email,
                searchUpload: true,
            },
        });
        setCurrentModel(model);
    }

    const onCancel = () => history.push('/');

    return (
        <div>
            <Header>Search by Model</Header>
            <Subheader>
                Upload your model to see other models with similar geometry.
            </Subheader>
            {isUploading ? (
                <UploadProgress />
            ) : currentModel ? (
                <Results modelId={currentModel.id} />
            ) : (
                <>
                    <form>
                        <Uploader
                            showError={!!uploadError}
                            setFile={handleFile}
                        />
                    </form>
                    <CancelButton onClick={onCancel}>Cancel</CancelButton>
                </>
            )}
        </div>
    );
}

const Matching = WithNewThemeLayout(Page);

export { Matching };
