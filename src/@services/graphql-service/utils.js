const hasEndSlash = /\/$/;

const media = path => {
    const url = process.env.REACT_APP_API_KEY;
    const mediaUrl = url.replace('api', 'media');
    return `${mediaUrl}/${path}`;
};

const withEndSlash = path => {
    if (hasEndSlash.test(path)) {
        return path;
    }
    return `${path}/`;
};

const getGraphQLUrl = () => {
    const url = process.env.REACT_APP_API_KEY;
    const graphqlUrl = url.replace('api', 'graphql');
    return withEndSlash(graphqlUrl);
};

export { media, getGraphQLUrl };
