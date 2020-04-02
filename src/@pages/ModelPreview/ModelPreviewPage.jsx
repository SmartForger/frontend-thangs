import React from 'react';
import styled from 'styled-components';

import { ModelCollection } from '@components/ModelCollection';
import { UserInline } from '@components/UserInline';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg';
import { ModelDetails } from './ModelDetailsPlaceholder';

const BackButton = styled.button`
    width: 48px;
    height: 48px;
    border-radius: 48px;
    padding: 0;
    border: 0;
    margin-right: 16px;
`;

const HeaderStyled = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0;
`;

const ModelContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ModelViewer = styled.div`
    flex-grow: 1;
    background: ${props => props.theme.modelViewerPlaceholder};
    border-radius: 8px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    height: 416px;
    min-width: 50%;
    margin-top: 8px;
    margin-right: 56px;
    margin-bottom: 48px;
`;

const Sidebar = styled.div`
    margin: 8px 0 0 8px;

    > table {
        margin-bottom: 24px;
        font-family: Montserrat-Regular;
        font-size: 14px;
        font-weight: normal;
        line-height: 18px;
    }
    > table td:first-child {
        color: ${props => props.theme.modelDetailLabel};
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;
        text-transform: uppercase;
    }
`;

const Button = styled.button`
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 28px;
    font-family: Montserrat-Medium;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    border: none;
`;

const ActionButton = styled(Button)`
    background: ${props => props.theme.modelActionButtonBackground};
    color: ${props => props.theme.modelActionButtonText};
    > svg {
        margin-right: 8px
        fill: ${props => props.theme.modelActionButtonText};
    }
`;

const PrimaryButton = styled(Button)`
    background: ${props => props.theme.modelPrimaryButtonBackground};
    color: ${props => props.theme.modelPrimaryButtonText};
`;

const ModelPreviewPage = ({ model, currentUser }) => {
    // Temporary placeholder data.
    const relatedModels = createBatch(10, modelFactory);
    model.owner = userFactory();
    model.attachment = attachmentFactory();

    return (
        <>
            <HeaderStyled>
                <BackButton>
                    <BackArrow />
                </BackButton>
                <h2>{model.name}</h2>
            </HeaderStyled>
            <ModelContainer>
                <ModelViewer></ModelViewer>
                <Sidebar>
                    <ActionButton>
                        <HeartIcon /> Like
                    </ActionButton>
                    {model.owner && (
                        <UserInline size="48px" user={model.owner} />
                    )}
                    <ModelDetails model={model} />
                    <PrimaryButton>View details</PrimaryButton>
                </Sidebar>
            </ModelContainer>
            <ModelCollection models={relatedModels} />
        </>
    );
};

export { ModelPreviewPage };

function createBatch(number, factory) {
    const batch = [];
    for (let i = 1; i <= number; i++) {
        batch.push(factory(i));
    }
    return batch;
}

const userFactory = (index = 1) => ({
    fullName: `Test User ${index}`,
    profile: {},
});

const attachmentFactory = (index = 1) => ({
    material: 'Aluminum',
    height: 55.5,
    length: 25.5,
    width: 30,
    weight: 300,
    ansi: true,
});

const modelFactory = (index = 1) => ({
    name: `Related model ${index}`,
    owner: userFactory(),
    likesCount: 2014,
    commentsCount: 365,
    attachment: attachmentFactory(),
});
