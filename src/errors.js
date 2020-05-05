import StackdriverErrorReporter from 'stackdriver-errors-js';

const errorHandler = new StackdriverErrorReporter();

export function initializeErrorReporter({
    googleCloudApiKey,
    googleCloudProjectId,
    environment,
    overrideEnabled = false,
}) {
    const errorReportingDisabled =
        environment === 'development' && overrideEnabled !== true;
    errorHandler.start({
        key: googleCloudApiKey,
        projectId: googleCloudProjectId,
        service: getServiceName(environment),
        version: environment,
        disabled: errorReportingDisabled,
    });
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
