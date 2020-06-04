import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { useDeleteFolder } from '../../@customHooks/Folders';
import { DropdownMenu, DropdownItem } from '../DropdownMenu';
import { FolderManagementModal } from '../FolderManagementModal';
import { FlashContext } from '../Flash';
import { TextButton } from '../Button';
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg';
import { ReactComponent as TrashCanIcon } from '../../@svg/trash-can-icon.svg';
import { ReactComponent as FolderManagementIcon } from '../../@svg/folder-management-icon.svg';
import { Spinner } from '../Spinner';
import { ReactComponent as ErrorIcon } from '../../@svg/error-triangle.svg';
import { BLUE_2 } from '../../@style/colors';
import { smallHeaderText, breadcrumbTextLight } from '../../@style/text';

const FolderIconStyled = styled(FolderIcon)`
    fill: ${BLUE_2};
    margin-right: 16px;
`;

const SpinnerStyled = styled(Spinner)`
    width: 18px;
    height: 18px;
    & .path {
        stroke: currentColor;
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const ErrorIconStyled = styled(ErrorIcon)`
    width: 18px;
    height: 18px;
`;

function DeleteMenu({ folderId }) {
    const [deleteFolder, { loading, error }] = useDeleteFolder(folderId);
    const history = useHistory();
    const [, { navigateWithFlash }] = useContext(FlashContext);

    const handleDelete = async e => {
        e.preventDefault();
        await deleteFolder();
        navigateWithFlash('/home', 'Folder deleted');
    };

    return (
        <DropdownMenu
            css={`
                margin-left: 16px;
            `}
        >
            <DropdownItem to="#" onClick={handleDelete}>
                {loading ? (
                    <SpinnerStyled />
                ) : error ? (
                    <ErrorIconStyled />
                ) : (
                    <TrashCanIcon />
                )}

                <span>Delete Folder</span>
            </DropdownItem>
        </DropdownMenu>
    );
}

const ManagementButton = styled(TextButton)`
    margin-left: 24px;
    display: flex;
    align-items: center;
`;

function ManageUsers({ folder }) {
    const [isOpen, setIsOpen] = useState();
    const [, { setFlash }] = useContext(FlashContext);

    const afterInvite = () => {
        setFlash('Users invited successfully.');
        setIsOpen(false);
    };
    const handleCancel = () => setIsOpen(false);
    const handleClick = () => setIsOpen(true);

    return (
        <>
            <ManagementButton onClick={handleClick}>
                <FolderManagementIcon />
            </ManagementButton>
            <FolderManagementModal
                folder={folder}
                onCancel={handleCancel}
                afterInvite={afterInvite}
                isOpen={isOpen}
            />
        </>
    );
}

export function Breadcrumbs({ modelsCount, folder, className }) {
    return (
        <Row className={className}>
            <Row
                css={`
                    ${breadcrumbTextLight};
                    ::after {
                        content: '>';
                        margin-left: 16px;
                        margin-right: 24px;
                    }
                `}
            >
                <div>All Models</div>{' '}
                <div
                    css={`
                        margin-left: 4px;
                    `}
                >
                    {modelsCount}
                </div>
            </Row>
            <Row
                css={`
                    ${smallHeaderText};
                `}
            >
                <FolderIconStyled />
                <div>{folder.name}</div>
                <DeleteMenu folderId={folder.id} />
                <ManageUsers folder={folder} />
            </Row>
        </Row>
    );
}
