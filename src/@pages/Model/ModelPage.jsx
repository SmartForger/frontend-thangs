import React from 'react';
import styled from 'styled-components';
import { CommentsForModel, ModelViewer } from '@components';

const ViewerArea = styled.div`
    display: grid;
    height: 100%;
    position: relative;
    grid-template-columns: 85% 15%;
    grid-template-rows: 60px 610px;
    grid-template-areas:
        'header  header'
        'viewer  sidebar';
`;

const Name = styled.h1`
    border-right: 2px solid ${props => props.theme.black};
    padding-right: 8px;
    margin: 0 8px 0 0;
`;

const OwnerStyled = styled.h3`
    padding-top: 2px;
    margin: 0;
`;

const Comments = styled(CommentsForModel)`
    margin: auto;
`;

const Owner = ({ owner }) => {
    if (!owner) {
        return null;
    }

    return (
        <OwnerStyled>
            Uploaded By: {owner.firstName} {owner.lastName}
        </OwnerStyled>
    );
};

const HeaderStyled = styled.div`
    grid-area: header;
    display: flex;
    align-items: center;
`;

const Header = ({ model, user }) => {
    const { owner, name } = model;
    return (
        <HeaderStyled>
            <Name>{name}</Name>
            <Owner owner={owner} />
        </HeaderStyled>
    );
};

const ModelPage = ({ model, user }) => {
    return (
        <>
            <ViewerArea>
                <Header model={model} user={user} />
                <ModelViewer model={model} user={user} />
            </ViewerArea>
            <Comments model={model} />
        </>
    );
};

export { ModelPage };
