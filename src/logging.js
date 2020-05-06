import StackdriverErrorReporter from 'stackdriver-errors-js';

let errorReporter;

export const logger = {
    init: initialize,
    ensureInitialized,
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error(message, ...args) {
        this.ensureInitialized();
        return errorReporter.report(message, ...args);
    },
};

function ensureInitialized() {
    if (errorReporter === undefined) {
        throw new Error(
            'Error handler not initialized, initializeErrorReporter() must be called first'
        );
    }
}

function initialize({
    googleCloudApiKey,
    googleCloudProjectId,
    environment,
    overrideEnabled = false,
}) {
    const errorReportingDisabled =
        environment === 'development' && overrideEnabled !== true;
    if (!errorReportingDisabled) {
        errorReporter = new StackdriverErrorReporter();
        errorReporter.start({
            key: googleCloudApiKey,
            projectId: googleCloudProjectId,
            service: getServiceName(environment),
            version: environment,
            disabled: errorReportingDisabled,
        });
    } else {
        errorReporter = {
            report: console.error.bind(console),
        };
    }
}

function getServiceName(environment) {
    switch (environment) {
        case 'development':
            return 'development-thangs-frontend';
        case 'staging':
            return 'staging-thangs-frontend';
        case 'production':
        default:
            return 'thangs-frontend';
    }
}
