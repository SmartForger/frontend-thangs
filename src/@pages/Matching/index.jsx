import React, { useState } from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style/Layout';
import { Uploader } from '@components/Uploader';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';

const Header = styled.h1`
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.headerColor};
    margin-bottom: 24px;
`;

const graphqlService = GraphqlService.getInstance();

const Page = () => {
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
            <form>
                <Uploader setFile={handleFile} />
            </form>
            {currentModel && currentModel.id}
        </div>
    );
};

const Matching = WithNewThemeLayout(Page, { logoOnly: true });

export { Matching };
