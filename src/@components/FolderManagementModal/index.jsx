import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { UserInline } from '../UserInline';
import { Modal } from '../Modal';
import { authenticationService } from '../../@services';
import { TextButton } from '../Button';
import { mediaMdPlus } from '../../@style/media-queries';
import { InviteUsersForm, DisplayErrors } from '../FolderForm';
import { FolderInfo } from '../FolderInfo';
import { Spinner } from '../Spinner';
import { ReactComponent as TrashCanIcon } from '../../@svg/trash-can-icon.svg';
import { ReactComponent as ErrorIcon } from '../../@svg/error-triangle.svg';
import { useRevokeAccess } from '../../@customHooks/Folders';
import { GREY_12 } from '../../@style/colors';

const SpinnerStyled = styled(Spinner)`
    width: 18px;
    height: 18px;
    & .path {
        stroke: currentColor;
    }
`;

const ErrorIconStyled = styled(ErrorIcon)`
    width: 18px;
    height: 18px;
`;

const Row = styled.div`
    display: flex;
`;

const List = styled.ul`
    width: 100%;
`;

const Item = styled.li`
    display: block;
`;

function RevokeAccessButton({ folderId, targetUserId, children }) {
    const [revokeAccess, { loading, error }] = useRevokeAccess(
        folderId,
        targetUserId
    );
    const handleRevoke = async e => {
        e.preventDefault();
        try {
            await revokeAccess({
                variables: {
                    userId: targetUserId,
                },
            });
        } catch (e) {
            console.error('e', e);
        }
    };

    return (
        <TextButton onClick={handleRevoke}>
            {loading ? (
                <SpinnerStyled />
            ) : error ? (
                <ErrorIconStyled />
            ) : (
                children
            )}
        </TextButton>
    );
}

const TrashCanIconStyled = styled(TrashCanIcon)`
    color: ${GREY_12};
`;

function UserList({ users = [], folderId }) {
    const currentUserId = authenticationService.getCurrentUserId();

    return (
        <List>
            {users.map((user, idx) => {
                return (
                    <Item
                        key={idx}
                        isFirst={idx === 0}
                        css={`
                            margin-top: ${props =>
                                props.isFirst ? '0' : '16px'};
                        `}
                    >
                        <UserInline user={user} displayEmail>
                            {user.id !== currentUserId && (
                                <RevokeAccessButton
                                    targetUserId={user.id}
                                    folderId={folderId}
                                >
                                    <TrashCanIconStyled />
                                </RevokeAccessButton>
                            )}
                        </UserInline>
                    </Item>
                );
            })}
        </List>
    );
}

export function FolderManagementModal({
    isOpen,
    folder,
    afterInvite,
    onCancel,
    className,
}) {
    const [errors, setErrors] = useState();

    return (
        <Modal
            isOpen={isOpen}
            className={className}
            css={`
                width: 100%;
                ${mediaMdPlus} {
                    max-width: 500px;
                }
            `}
        >
            <FolderInfo
                name={folder.name}
                members={folder.members}
                models={folder.models}
                boldName
                hideModels
                css={`
                    padding: 0;
                `}
            />
            <DisplayErrors
                errors={errors}
                css={`
                    margin-bottom: 16px;
                `}
                serverErrorMsg="Unable to invite users. Please try again later."
            />
            <Row
                css={`
                    margin-top: 48px;
                `}
            >
                <InviteUsersForm
                    folderId={folder.id}
                    onErrorReceived={setErrors}
                    afterInvite={afterInvite}
                    onCancel={onCancel}
                    membersLabel="Add Members"
                />
            </Row>
            <Row
                css={`
                    margin-top: 48px;
                `}
            >
                <UserList users={folder.members} folderId={folder.id} />
            </Row>
        </Modal>
    );
}
