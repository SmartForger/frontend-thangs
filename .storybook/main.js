module.exports = {
    stories: ['../src/**/*.stories.jsx'],
    addons: [
        '@storybook/preset-create-react-app',
        '@storybook/addon-actions',
        '@storybook/addon-links',
    ],
    webpackFinal: async (config, { configType }) => {
        // By default build-storybook builds in Webpack's production mode.
        // Something in our application code (the ESM import/export syntax) gets
        // mangled by production mode. This forces development mode for all
        // storybook builds.
        config.mode = 'development';
        // Dumping the generated webpack config for good measure :)
        console.dir(config, { depth: null });
        return config;
    },
};
