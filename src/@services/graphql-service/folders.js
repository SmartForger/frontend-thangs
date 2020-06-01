import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { USER_QUERY } from './users';

export const FOLDER_QUERY = gql`
    query folderQuery($id: ID) {
        folder(id: $id) {
            id
            size
            models {
                id
            }
            members {
                id
            }
        }
    }
`;

function parseFolder(folder) {
    return { ...folder };
}

export const useFolderById = id => {
    const { loading, error, data } = useQuery(FOLDER_QUERY, {
        variables: { id },
    });
    const folder = data && parseFolder(data.folder);
    return { loading, error, folder };
};

export const CREATE_FOLDER_MUTATION = gql`
    mutation createFolder($name: String!, $members: [String]) {
        createFolder(name: $name, members: $members) {
            folder {
                id
                name
            }
        }
    }
`;

export const useCreateFolderMutation = id => {
    return useMutation(CREATE_FOLDER_MUTATION, {
        refetchQueries: [
            {
                query: USER_QUERY,
                variables: { id },
            },
        ],
    });
};

export const INVITE_TO_FOLDER_MUTATION = gql`
    mutation inviteToFolder($folderId: ID, $emails: [String]) {
        inviteToFolder(folderId: $folderId, emails: $emails) {
            folder {
                id
                members {
                    id
                }
            }
        }
    }
`;

export const useInviteToFolderMutation = id => {
    return useMutation(INVITE_TO_FOLDER_MUTATION, {
        refetchQueries: [
            {
                query: FOLDER_QUERY,
                variables: { id },
            },
        ],
    });
};

export const REVOKE_ACCESS_MUTATION = gql`
    mutation revokeAccess($name: String!, $members: [String]) {
        revokeAccess(folderId: $folderId, userId: $userId) {
            folder {
                id
                members {
                    id
                }
            }
        }
    }
`;

export const useRevokeAccessMutation = (folderId, userId) => {
    return useMutation(REVOKE_ACCESS_MUTATION, {
        refetchQueries: [
            {
                query: FOLDER_QUERY,
                variables: { folderId, userId },
            },
        ],
    });
};
