import React, { useState } from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style/Layout';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { ModelCollection } from '@components/ModelCollection';

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

function Loading() {
    return <div>Loading</div>;
}

function Results({ modelId }) {
    const { loading, error, model } = graphqlService.useModelByIdWithRelated(
        modelId,
    );

    if (loading || (model && model.uploadStatus === PROCESSING)) {
        return <Loading />;
    }

    if (error || !model || model.uploadStatus === ERROR) {
        return (
            <div>
                There was an error analyzing your model. Please try again later.
            </div>
        );
    }

    return <ModelCollection models={model.relatedModels} />;
}

function Page() {
    const [currentModel, setCurrentModel] = useState();
    const [uploadModel] = graphqlService.useUploadModelMutation();

    async function handleFile(file) {
        const model = await uploadModel({
            variables: {
                file,
                name: file.name,
                size: file.size,
                userEmail: authenticationService.currentUserValue.email,
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
            {currentModel ? (
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
