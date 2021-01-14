/* global Communicator */
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { colorHexStringToRGBArray, ensureScriptIsLoaded } from '@utilities'
import axios from 'axios'
import { track } from '@utilities/analytics'
import * as path from 'path'

const MODEL_PREP_TIMEOUT = 180000
const REACT_APP_MODEL_BUCKET = process.env.REACT_APP_MODEL_BUCKET

const debug = (...args) => {
  if (process.env.REACT_APP_DEBUG) {
    // eslint-disable-next-line no-console
    console.log('debug', ...args)
  }
}

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
}

const TRANSITIONS = {
  PrepareModelDone: 'T_PREPARE_MODEL_DONE',
  LoadModelDone: 'T_LOAD_MODEL_DONE',
  Reset: 'T_RESET',
  Error: 'T_ERROR',
}

class HoopsStatus {
  constructor(state) {
    this._state = state
  }

  get state() {
    return this._state
  }

  get isPending() {
    return this.state === STATES.UnpreparedModel || this.state === STATES.PreparedModel
  }

  get isUnpreparedModel() {
    return this.state === STATES.UnpreparedModel
  }

  get isPreparedModel() {
    return this.state === STATES.PreparedModel
  }

  get isError() {
    return this.state === STATES.Errored
  }

  get isReady() {
    return this.state === STATES.Ready
  }
}

const hoopsStatusReducer = (currentStatus, transition) => {
  debug(`> Reducer Action: ${currentStatus.state} -> ${transition}`)
  switch (transition) {
    case TRANSITIONS.PrepareModelDone:
      return new HoopsStatus(STATES.PreparedModel)
    case TRANSITIONS.LoadingDone:
      return new HoopsStatus(STATES.Ready)
    case TRANSITIONS.Reset:
      return new HoopsStatus(STATES.UnpreparedModel)
    case TRANSITIONS.Error:
      return new HoopsStatus(STATES.Errored)
    default:
      return currentStatus
  }
}

const useHoopsViewer = ({ modelFilename }) => {
  const containerRef = useRef()
  const hoopsViewerRef = useRef()
  const [hoopsStatus, doTransition] = useReducer(
    hoopsStatusReducer,
    new HoopsStatus(STATES.UnpreparedModel)
  )

  const handleResize = useCallback(() => {
    if (hoopsViewerRef.current && hoopsViewerRef.current.resizeCanvas) {
      hoopsViewerRef.current.resizeCanvas()
    }
  }, [])

  useEffect(() => {
    debug('1. Initialize Effect')

    if (!hoopsStatus.isUnpreparedModel) {
      debug('  * 1: Bailed')
      return
    }
    let isActiveEffect = true
    const prepCancelSource = axios.CancelToken.source()

    debug('  * 1: Loading Script')
    ensureScriptIsLoaded('vendors/hoops/hoops_web_viewer.js')
      .then(async () => {
        debug('  * 1: Preparing Model')
        // const resp = await axios.get(`${MODEL_PREP_ENDPOINT_URI}/${modelURL}`, {
        //   cancelToken: prepCancelSource.token,
        // })

        // if (!resp.data.ok) {
        //   track('HOOPS ModelPreparationFailed', { error: 'Model preparation failed' })
        //   throw new Error('Model preparation failed.')
        // }

        if (isActiveEffect) {
          debug('  * 1: Done Prepping Model')
          doTransition(TRANSITIONS.PrepareModelDone)
        }
      })
      .catch(err => {
        track('HOOPS FailureInitViewer', { error: JSON.stringify(err) })
        if (isActiveEffect) {
          doTransition(TRANSITIONS.Error)
        }
      })

    const timeoutId = setTimeout(() => {
      track('HOOPS Timeout', JSON.stringify(hoopsStatus))
      prepCancelSource.cancel('Model preparation exceeded timeout.')
    }, MODEL_PREP_TIMEOUT)

    return () => {
      debug('  * 1: Cleanup. Cancel any pending model prep request.')
      isActiveEffect = false
      clearTimeout(timeoutId)
      prepCancelSource.cancel('Model preparation canceled by user. (Effect cleanup)')
    }
  }, [hoopsStatus, modelFilename])

  useEffect(() => {
    debug('2. HWV Shutdown Registering Effect')
    return () => {
      if (hoopsViewerRef.current) {
        debug('  ** 2: Cleanup!  HWV Shutdown! **')
        try {
          hoopsViewerRef.current.shutdown()
        } catch (e) {
          return
        } finally {
          hoopsViewerRef.current = null
        }
        doTransition(TRANSITIONS.Reset)
      }
    }
  }, [modelFilename])

  useEffect(() => {
    debug('3. HWV Creation Effect')

    debug('  * 3: Add resizer')
    window.addEventListener('resize', handleResize)

    if (!hoopsStatus.isPreparedModel) {
      debug('  * 3: Bailed')
      return
    }

    debug('  * 3: Create HWV')
    let modelUri = `${REACT_APP_MODEL_BUCKET}${decodeURIComponent(modelFilename)}`
    const viewer = new Communicator.WebViewer({
      container: containerRef.current,
      endpointUri: modelUri.replace(/\s/g, '_').replace(path.extname(modelUri), '.scs'),
      enginePath: '/vendors/hoops',
      rendererType: Communicator.RendererType.Client,
    })

    viewer.setCallbacks({
      sceneReady() {
        // passing "null" sets the background to transparent
        debug('  * 3: HWV Model Load')
        viewer.view.setBackgroundColor(null, null)
        doTransition(TRANSITIONS.LoadingDone)
      },
      modelLoadFailure(name, reason, e) {
        doTransition(TRANSITIONS.Error)
        console.error('HOOPS failed loading the model:', e)
        track('HOOPS ModelLoadFailure', { error: JSON.stringify(e) })
      },
      // This is to fix the issue with the viewer aspect ratio being
      // off until the browser is resized or snapshot, for some reason.
      // Calling resize on this event resizes and doesn't have any flash
      // as far as I can see - BE
      firstModelLoaded() {
        handleResize()
      },
    })

    viewer.start()

    hoopsViewerRef.current = viewer
    return () => {
      debug('  * 3: Cleanup! remove resizer')
      window.removeEventListener('resize', handleResize)
    }
  }, [hoopsStatus, modelFilename, handleResize])

  const ensureCurrentHoopsViewer = () => {
    if (!hoopsViewerRef.current) {
      return
    }
  }

  const changeColor = useCallback((modeName, colorStr) => {
    track('changeColor', { color: colorStr })
    ensureCurrentHoopsViewer()
    if (!['wire', 'mesh'].includes(modeName)) {
      throw new Error(`Unsupported HOOPS color change mode: ${modeName}`)
    }

    const hColor = new Communicator.Color(...colorHexStringToRGBArray(colorStr))
    const model = hoopsViewerRef.current.model

    const gatherLeafNodeIds = nodes => {
      return nodes.flatMap(node => {
        const kids = model.getNodeChildren(node)
        if (kids.length === 0) {
          return node
        }
        return gatherLeafNodeIds(kids)
      })
    }

    const nodeIds = gatherLeafNodeIds(model.getNodeChildren(model.getAbsoluteRootNode()))

    try {
      if (modeName === 'wire') {
        model.setNodesLineColor(nodeIds, hColor)
      } else {
        model.setNodesFaceColor(nodeIds, hColor)
      }
    } catch (e) {
      return
    }
  }, [])

  const changeDrawMode = useCallback(modeName => {
    track('changeDrawMode', { mode: modeName })
    ensureCurrentHoopsViewer()
    switch (modeName) {
      case 'shaded':
        hoopsViewerRef.current.view.setDrawMode(Communicator.DrawMode.WireframeOnShaded)
        break
      case 'wire':
        hoopsViewerRef.current.view.setDrawMode(Communicator.DrawMode.Wireframe)
        break
      case 'xray':
        hoopsViewerRef.current.view.setDrawMode(Communicator.DrawMode.XRay)
        break
      default:
        return
    }
  }, [])

  const changeExplosionMagnitude = useCallback(magnitude => {
    track('changeExplosionMagnitude')
    ensureCurrentHoopsViewer()
    hoopsViewerRef.current.explodeManager.setMagnitude(magnitude)
  }, [])

  const changeViewOrientation = useCallback(orientation => {
    track('changeViewOrientation', { orientation })
    hoopsViewerRef.current.view.setViewOrientation(
      Communicator.ViewOrientation[orientation],
      1000
    )
  }, [])

  const getViewerSnapshot = useCallback(fileName => {
    track('getViewerSnapshot')
    hoopsViewerRef.current.takeSnapshot().then(imgElement => {
      let imageHeight = containerRef.current.childNodes[0].offsetHeight
      let imageWidth = containerRef.current.childNodes[0].offsetWidth
      let timestamp = new Date().toLocaleString()
      let myCanvasElement = document.createElement('canvas')
      myCanvasElement.width = imageWidth
      myCanvasElement.height = imageHeight
      let context = myCanvasElement.getContext('2d')
      context.fillStyle = 'white'
      context.fillRect(0, 0, imageWidth, imageHeight)
      context.drawImage(imgElement, 0, 0, imageWidth, imageHeight)
      let img = myCanvasElement.toDataURL('image/png')
      let link = document.createElement('a')
      link.download = `${fileName}-${timestamp}.png`
      link.href = img
      link.click()
    })
  }, [])

  const resetImage = useCallback(() => {
    track('resetViewer')
    ensureCurrentHoopsViewer()
    hoopsViewerRef.current.reset()
    hoopsViewerRef.current.model.resetNodesColor()
  }, [])

  return {
    containerRef,
    hoops: {
      status: hoopsStatus,
      resetImage,
      changeColor,
      changeDrawMode,
      changeExplosionMagnitude,
      changeViewOrientation,
      getViewerSnapshot,
    },
  }
}

export default useHoopsViewer
