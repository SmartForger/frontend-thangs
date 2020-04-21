import React, { useState } from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style/Layout';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { ModelCollection } from '@components/ModelCollection';
import { UploadProgress } from '@components/UploadProgress';

const PROCESSING = 'PROCESSING';
const ERROR = 'ERROR';

const Header = styled.h1`
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.headerColor};
    margin-bottom: 16px;
`;

const Subheader = styled.h4`
    margin-bottom: 24px;
    font-size: 18px;
`;

const graphqlService = GraphqlService.getInstance();

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
        <ModelCollection
            models={model.relatedModels}
            noResultsText="No Geometric Similar Matches Found"
            noResultsSubtext="Try uploading a different model."
        />
    );
}

function Page() {
    const [currentModel, setCurrentModel] = useState();
    const currentUser = authenticationService.currentUserValue;
    const { id } = currentUser;
    const [
        uploadModel,
        { loading: isUploading },
    ] = graphqlService.useUploadModelMutation(id);

    async function handleFile(file) {
        const model = await uploadModel({
            variables: {
                // To do, clean up the calls to the upload mutation (e.g remove file param)
                file,
                name: file.name,
                size: file.size,
                units: 'mm',
                userEmail: authenticationService.currentUserValue.email,
                searchUpload: true,
            },
        });

        setCurrentModel(model);
    }

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
                <form>
                    <Uploader setFile={handleFile} />
                </form>
            )}
        </div>
    );
}

const Matching = WithNewThemeLayout(Page, { logoOnly: true });

export { Matching };
