import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Modal } from '../Modal';
import { CreateFolderForm, DisplayErrors } from '../FolderForm';
import { ReactComponent as NewFolderIcon } from '../../@svg/folder-plus-icon.svg';
import { headerText, lightText } from '../../@style/text';

const Header = styled.h2`
    ${headerText};
`;

const Text = styled.div`
    ${lightText};
`;

const Row = styled.div`
    display: flex;
`;

export function FolderCreateModal({ isOpen, onCancel, afterCreate }) {
    const [errors, setErrors] = useState();
    return (
        <Modal isOpen={isOpen}>
            <NewFolderIcon
                css={`
                    margin-bottom: 16px;
                `}
            />
            <Header
                css={`
                    margin-bottom: 16px;
                `}
            >
                Add Folder
            </Header>
            <Text>
                Create a team and share models with other teamates  privately
                for collaboration.
            </Text>
            <DisplayErrors
                errors={errors}
                css={`
                    margin-bottom: 16px;
                `}
                serverErrorMsg="Unable to create folder. Please try again later."
            />
            <Row
                css={`
                    margin-top: 48px;
                `}
            >
                <CreateFolderForm
                    onErrorReceived={setErrors}
                    afterCreate={afterCreate}
                    onCancel={onCancel}
                    includeNameField
                />
            </Row>
        </Modal>
    );
}
