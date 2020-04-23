import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { WithNewThemeLayout } from '@style/Layout';
import { Button } from '@components/Button';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { ModelCollection } from '@components/ModelCollection';
import { UploadProgress } from '@components/UploadProgress';

import { pageTitleText } from '@style/text';

const PROCESSING = 'PROCESSING';
const ERROR = 'ERROR';

const Header = styled.h1`
    ${pageTitleText};
    margin-bottom: 16px;
`;

const Subheader = styled.h4`
    margin-bottom: 24px;
    font-size: 18px;
    color: ${props => props.theme.matchingSubheaderColor};
`;

const Frame = styled.div`
    margin-top: 48px;
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
        <ModelCollection
            models={model.relatedModels}
            noResultsText="No geometric similar matches found. Try uploading another model."
        />
    );
}

function Page() {
    const [currentModel, setCurrentModel] = useState();
    const history = useHistory();
    const currentUser = authenticationService.currentUserValue;
    const { id } = currentUser;
    const [
        uploadModel,
        { loading: isUploading, error: uploadError },
    ] = graphqlService.useUploadModelMutation(id);

    async function handleFile(file) {
        const model = await uploadModel(file, {
            variables: {
                name: file.name,
                size: file.size,
                userEmail: authenticationService.currentUserValue.email,
                searchUpload: true,
            },
        });
        setCurrentModel(model);
    }

    const onCancel = () => history.push('/');

    return (
        <Frame>
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
        </Frame>
    );
}

const Matching = WithNewThemeLayout(Page, { logoOnly: true });

export { Matching };
