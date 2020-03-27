import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

const ALL_NEWSPOSTS_QUERY = gql`
    query {
        allNewsposts {
            id
            title
            content
            owner {
                id
                firstName
                lastName
                profile {
                    avatar
                }
            }
            created
        }
    }
`;

const parseAllNewspostsPayload = data => {
    if (!data || !data.allNewsposts) {
        return [];
    }

    return data.allNewsposts;
};

const useAllNewsposts = () => {
    const { loading, error, data } = useQuery(ALL_NEWSPOSTS_QUERY);
    const newsposts = parseAllNewspostsPayload(data);
    return { loading, error, newsposts };
};

export { useAllNewsposts };
