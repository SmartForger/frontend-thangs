/* global Communicator */
import { useState, useCallback, useEffect, useReducer, useRef } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as GraphqlService from '@services/graphql-service';

import { colorHexStringToRGBArray, ensureScriptIsLoaded } from '@utilities';
import axios from 'axios';
const graphqlService = GraphqlService.getInstance();

export const useStl = url => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url, {
                    headers: {
                        Origin: window.location.origin,
                        'Content-Type': 'application/octet-stream',
                    },
                });
                const blob = await response.blob();
                const data = await blob.arrayBuffer();

                const loader = new STLLoader();
                const geometry = loader.parse(data);
                setData(geometry);
                setLoading(false);
            } catch (e) {
                console.error('Could not load model data', e);

                setError(e);
            }
        }
        fetchData();
    }, [url]);

    return [data, loading, error];
};

const MODEL_PREP_TIMEOUT = 15000;
const MODEL_PREP_ENDPOINT_URI =
    process.env.REACT_APP_HOOPS_MODEL_PREP_ENDPOINT_URI;
const HOOPS_WS_ENDPOINT_URI = process.env.REACT_APP_HOOPS_WS_ENDPOINT_URI;

const debug = (...args) => {
    if (process.env.REACT_APP_DEBUG) {
        console.debug(...args);
    }
};

/**
 *   *----------------------------*
 *   | HOOPS Initialization State |                  (Ready)
 *   |        Machine             |                     ^
 *   *----------------------------*                     |
 *                                                *loading-done*
 *                                                      |
 *    (UnpreparedModel) - - *prepare-done* - - > (PreparedModel)
 *          \                                         /
 *        *error*                                 *error*
 *            \                                     /
 *              - - - - - > (Errored) < - - - - - -
 */
const STATES = {
    UnpreparedModel: 'S_UNPREPARED_MODEL',
    PreparedModel: 'S_PREPARED_MODEL',
    Ready: 'S_READY',
    Errored: 'S_ERRORED',
};

const TRANSITIONS = {
    PrepareModelDone: 'T_PREPARE_MODEL_DONE',
    LoadModelDone: 'T_LOAD_MODEL_DONE',
    Reset: 'T_RESET',
    Error: 'T_ERROR',
};

class HoopsStatus {
    constructor(state) {
        this._state = state;
    }

    get state() {
        return this._state;
    }

    get isPending() {
        return (
            this.state === STATES.UnpreparedModel ||
            this.state === STATES.PreparedModel
        );
    }

    get isUnpreparedModel() {
        return this.state === STATES.UnpreparedModel;
    }

    get isPreparedModel() {
        return this.state === STATES.PreparedModel;
    }

    get isError() {
        return this.state === STATES.Errored;
    }

    get isReady() {
        return this.state === STATES.Ready;
    }
}

const hoopsStatusReducer = (currentStatus, transition) => {
    debug(`> Reducer Action: ${currentStatus.state} -> ${transition}`);
    switch (transition) {
        case TRANSITIONS.PrepareModelDone:
            return new HoopsStatus(STATES.PreparedModel);
        case TRANSITIONS.LoadingDone:
            return new HoopsStatus(STATES.Ready);
        case TRANSITIONS.Reset:
            return new HoopsStatus(STATES.UnpreparedModel);
        case TRANSITIONS.Error:
            return new HoopsStatus(STATES.Errored);
        default:
            return currentStatus;
    }
};

export const useHoopsViewer = modelFilename => {
    const containerRef = useRef();
    const hoopsViewerRef = useRef();
    const [hoopsStatus, doTransition] = useReducer(
        hoopsStatusReducer,
        new HoopsStatus(STATES.UnpreparedModel)
    );

    useEffect(() => {
        debug('1. Initialize Effect');
        if (!hoopsStatus.isUnpreparedModel) {
            debug('  * 1: Bailed');
            return;
        }
        let isActiveEffect = true;
        const prepCancelSource = axios.CancelToken.source();

        debug('  * 1: Loading Script');
        ensureScriptIsLoaded('vendors/hoops_web_viewer.js')
            .then(async () => {
                debug('  * 1: Preparing Model');
                const resp = await axios.get(
                    `${MODEL_PREP_ENDPOINT_URI}/${modelFilename}`,
                    {
                        cancelToken: prepCancelSource.token,
                    }
                );

                if (!resp.data.ok) {
                    throw new Error('Model preparation failed.');
                }

                if (isActiveEffect) {
                    debug('  * 1: Done Prepping Model');
                    doTransition(TRANSITIONS.PrepareModelDone);
                }
            })
            .catch(err => {
                console.error('Failure initializing Viewer:', err);
                if (isActiveEffect) {
                    doTransition(TRANSITIONS.Error);
                }
            });

        const timeoutId = setTimeout(() => {
            prepCancelSource.cancel('Model preparation exceeded timeout.');
        }, MODEL_PREP_TIMEOUT);

        return () => {
            debug('  * 1: Cleanup. Cancel any pending model prep request.');
            isActiveEffect = false;
            clearTimeout(timeoutId);
            prepCancelSource.cancel(
                'Model preparation canceled by user. (Effect cleanup)'
            );
        };
    }, [hoopsStatus, modelFilename]);

    useEffect(() => {
        debug('2. HWV Shutdown Registering Effect');
        return () => {
            if (hoopsViewerRef.current) {
                debug('  ** 2: Cleanup!  HWV Shutdown! **');
                try {
                    hoopsViewerRef.current.shutdown();
                } catch (e) {
                    console.error('HWV failed to shutdown:', e);
                } finally {
                    hoopsViewerRef.current = null;
                }
                doTransition(TRANSITIONS.Reset);
            }
        };
    }, [modelFilename]);

    useEffect(() => {
        debug('3. HWV Creation Effect');
        if (!hoopsStatus.isPreparedModel) {
            debug('  * 3: Bailed');
            return;
        }

        debug('  * 3: Create HWV');
        const viewer = new Communicator.WebViewer({
            container: containerRef.current,
            endpointUri: HOOPS_WS_ENDPOINT_URI,
            model: `${modelFilename}.scz`,
            rendererType: Communicator.RendererType.Client,
        });

        viewer.setCallbacks({
            sceneReady() {
                // passing "null" sets the background to transparent
                debug('  * 3: HWV Model Load');
                viewer.view.setBackgroundColor(null, null);
                doTransition(TRANSITIONS.LoadingDone);
            },
            modelLoadFailure(name, reason, e) {
                console.error('HOOPS failed loading the model:', e);
                doTransition(TRANSITIONS.Error);
            },
        });

        viewer.start();

        const handleResize = () => {
            viewer.resizeCanvas();
        };
        window.addEventListener('resize', handleResize);

        hoopsViewerRef.current = viewer;
        return () => {
            debug('  * 3: Cleanup! remove resizer');
            window.removeEventListener('resize', handleResize);
        };
    }, [hoopsStatus, modelFilename]);

    const ensureCurrentHoopsViewer = () => {
        if (!hoopsViewerRef.current) {
            return;
        }
    };

    const changeDrawMode = useCallback(modeName => {
        ensureCurrentHoopsViewer();
        switch (modeName) {
            case 'shaded':
                hoopsViewerRef.current.view.setDrawMode(
                    Communicator.DrawMode.WireframeOnShaded
                );
                break;
            case 'wire':
                hoopsViewerRef.current.view.setDrawMode(
                    Communicator.DrawMode.Wireframe
                );
                break;
            case 'xray':
                hoopsViewerRef.current.view.setDrawMode(
                    Communicator.DrawMode.XRay
                );
                break;
            default:
                console.error('Unsupported draw mode!', modeName);
        }
    }, []);

    const changeColor = useCallback((modeName, colorStr) => {
        ensureCurrentHoopsViewer();
        if (!['wire', 'mesh'].includes(modeName)) {
            throw new Error(`Unsupported HOOPS color change mode: ${modeName}`);
        }

        const hColor = new Communicator.Color(
            ...colorHexStringToRGBArray(colorStr)
        );
        const model = hoopsViewerRef.current.model;

        const gatherLeafNodeIds = nodes => {
            return nodes.flatMap(node => {
                const kids = model.getNodeChildren(node);
                if (kids.length === 0) {
                    return node;
                }
                return gatherLeafNodeIds(kids);
            });
        };

        const nodeIds = gatherLeafNodeIds(
            model.getNodeChildren(model.getAbsoluteRootNode())
        );

        try {
            if (modeName === 'wire') {
                model.setNodesLineColor(nodeIds, hColor);
            } else {
                model.setNodesFaceColor(nodeIds, hColor);
            }
        } catch (e) {
            console.error('Caught HOOPS error setting color:', e);
        }
    }, []);

    const resetImage = useCallback(() => {
        ensureCurrentHoopsViewer();
        hoopsViewerRef.current.reset();
        changeDrawMode('shaded');

        const wire = '#000000';
        const mesh = '#88888b';
        changeColor('wire', wire);
        changeColor('mesh', mesh);
        return [wire, mesh];
    }, [changeColor, changeDrawMode]);

    return {
        containerRef,
        hoops: {
            status: hoopsStatus,
            resetImage,
            changeDrawMode,
            changeColor,
        },
    };
};
