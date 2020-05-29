import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { USER_QUERY } from './users';

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
