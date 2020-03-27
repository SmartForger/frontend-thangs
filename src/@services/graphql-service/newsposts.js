import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

const ALL_NEWSPOSTS_QUERY = gql`
    query allNewsposts {
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

const NEWSPOST_QUERY = gql`
    query newspost($id: ID) {
        newspost(id: $id) {
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

const parseNewspostPayload = data => {
    if (!data || !data.newspost) {
        return null;
    }

    return data.newspost;
};

const useNewspostById = id => {
    const { loading, error, data } = useQuery(NEWSPOST_QUERY, {
        variables: { id },
    });
    const newspost = parseNewspostPayload(data);
    return { loading, error, newspost };
};

export { useAllNewsposts, useNewspostById };
