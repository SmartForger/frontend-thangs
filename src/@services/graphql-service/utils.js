const hasEndSlash = /\/$/;

const createAppUrl = path => {
    if (!path) {
        return null;
    }
    return new URL(path, process.env.REACT_APP_API_KEY).toString();
};

const withEndSlash = path => {
    if (hasEndSlash.test(path)) {
        return path;
    }
    return `${path}/`;
};

const getGraphQLUrl = () => {
    return withEndSlash(createAppUrl('/graphql'));
};

const getFileDataUrl = () => {
    return withEndSlash(createAppUrl('/api/model-data'));
};

export { createAppUrl, getGraphQLUrl, getFileDataUrl };
