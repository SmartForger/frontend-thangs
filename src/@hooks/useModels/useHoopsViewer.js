/* global Communicator */
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { colorHexStringToRGBArray, ensureScriptIsLoaded } from '@utilities'
import axios from 'axios'
import { track } from '@utilities/analytics'
import * as path from 'path'
import { throttle } from 'lodash'

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
  INIT: 0,
  SCRIPT_READY: 1,
  ERROR: 2,
  HWV_READY: 3,
  MODEL_LOADING: 4,
  MODEL_LOADED: 5,
  MODEL_ERROR: 6,
}

class HoopsStatus {
  constructor(state) {
    this._state = state
  }

  get state() {
    return this._state
  }

  get isReady() {
    return this._state > STATES.ERROR
  }

  get statusOverlayHidden() {
    return this._state === STATES.ERROR || this._state === STATES.MODEL_LOADED
  }

  get isPending() {
    return this._state <= STATES.MODEL_LOADING && this._state !== STATES.ERROR
  }

  get isError() {
    return this._state === STATES.ERROR || this._state === STATES.MODEL_ERROR
  }
}

const hoopsStatusReducer = (currentStatus, nextStatus) => {
  debug(`> Reducer Action: ${currentStatus.state} -> ${nextStatus}`)
  return new HoopsStatus(nextStatus)
}

const useHoopsViewer = ({ modelFilename, onHighlight }) => {
  const containerRef = useRef()
  const hoopsViewerRef = useRef()
  const [hoopsStatus, setHoopsStatus] = useReducer(
    hoopsStatusReducer,
    new HoopsStatus(STATES.INIT)
  )
  const cancelTokenRef = useRef()
  const hoopsStatusRef = useRef(new HoopsStatus(STATES.INIT))
  const allModelNodes = useRef([])
  const selectedNodes = useRef([])

  const doTransition = status => {
    setHoopsStatus(status)
    hoopsStatusRef.current = new HoopsStatus(status)
  }

  const handleResize = useCallback(() => {
    if (
      hoopsViewerRef &&
      hoopsViewerRef.current &&
      hoopsViewerRef.current.resizeCanvas &&
      typeof hoopsViewerRef.current.resizeCanvas === 'function' &&
      hoopsStatusRef.current.isReady
    ) {
      hoopsViewerRef.current.resizeCanvas()
    }
  }, [])

  const createHWV = () =>
    new Promise((resolve, reject) => {
      const viewer = new Communicator.WebViewer({
        container: containerRef.current,
        enginePath: '/vendors/hoops',
        rendererType: Communicator.RendererType.Client,
      })

      viewer.setCallbacks({
        sceneReady() {
          viewer && viewer.view && viewer.view.setBackgroundColor(null, null)
          resolve()
        },
        modelLoadFailure(name, reason, e) {
          console.error('HOOPS failed loading the model:', name, reason, e)
          reject(e)
        },
        // This is to fix the issue with the viewer aspect ratio being
        // off until the browser is resized or snapshot, for some reason.
        // Calling resize on this event resizes and doesn't have any flash
        // as far as I can see - BE
        firstModelLoaded() {
          handleResize()
          viewer &&
            viewer.view &&
            viewer.view.setViewOrientation(
              Communicator.ViewOrientation['TopLeftFront'],
              1000
            )
        },
        selectionArray(selections) {
          const getIndexNodeId = (nodes, id) => {
            return nodes.current.findIndex(node => node.id === id)
          }
          if (selections.length > 0 && onHighlight) {
            selections.forEach(selectionItem => {
              let nodeId = selectionItem.getSelection().getNodeId()
              let index = -2

              while (nodeId && index < 0) {
                index = getIndexNodeId(allModelNodes, nodeId)
                nodeId = viewer.model.getNodeParent(nodeId)
              }

              if (
                index >= 0 &&
                selectedNodes.current[0] !== allModelNodes.current[index].id
              ) {
                selectedNodes.current[1] = allModelNodes.current[index].id
                onHighlight(allModelNodes.current[index].name)
              }
            })
          }
        },
      })

      viewer.start()

      hoopsViewerRef.current = viewer
    })

  const loadModel = useCallback(async filename => {
    if (!hoopsStatusRef.current.isReady) {
      return
    }

    try {
      if (cancelTokenRef && cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Getting model interrupted')
      }

      doTransition(STATES.MODEL_LOADING)
      const modelUri = `${REACT_APP_MODEL_BUCKET}${decodeURIComponent(filename).replace(
        '#',
        encodeURIComponent('#')
      )}`
      const endpointUri = modelUri
        .replace(/\s/g, '_')
        .replace(path.extname(modelUri), '.scs')

      cancelTokenRef.current = axios.CancelToken.source()
      const { data } = await axios.get(endpointUri, {
        cancelToken: cancelTokenRef.current.token,
        responseType: 'arraybuffer',
      })

      const model =
        hoopsViewerRef && hoopsViewerRef.current && hoopsViewerRef.current.model
      await model.clear()
      const rootNode = model.getAbsoluteRootNode()
      await model.loadSubtreeFromScsBuffer(rootNode, new Uint8Array(data))

      // window.__hoopsViewer = hoopsViewerRef.current

      const getAllNodes = (model, node, result) => {
        const nodeName = model.getNodeName(node)
        const nodeType = model.getNodeType(node)
        if (nodeType > 1) {
          return
        }

        result.push({
          id: node,
          name: nodeName,
        })
        const children = model.getNodeChildren(node)
        if (children.length > 0) {
          children.forEach(subnode => {
            getAllNodes(model, subnode, result)
          })
        }
      }

      const allNodes = []
      getAllNodes(model, rootNode, allNodes)
      allModelNodes.current = allNodes.reverse()

      doTransition(STATES.MODEL_LOADED)
      cancelTokenRef.current = null
    } catch (err) {
      try {
        if (hoopsViewerRef && hoopsViewerRef.current && hoopsViewerRef.current.model) {
          await hoopsViewerRef.current.model.clear()
          doTransition(STATES.MODEL_ERROR)
        }
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }
  }, [])

  useEffect(() => {
    ensureScriptIsLoaded('vendors/hoops/hoops_web_viewer.js')
      .then(() => createHWV())
      .then(() => {
        doTransition(STATES.HWV_READY)
        if (modelFilename) {
          setTimeout(() => {
            loadModel(modelFilename)
          }, 200)
        }
      })
      .catch(err => {
        console.error(err)
        doTransition(STATES.ERROR)
      })

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      if (hoopsViewerRef && hoopsViewerRef.current) {
        debug('  ** 2: Cleanup!  HWV Shutdown! **')
        try {
          hoopsViewerRef.current.shutdown()
          hoopsViewerRef.current = null
        } catch (error) {
          track('Hoops Error Shutting down', { error })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadModel(modelFilename)
  }, [loadModel, modelFilename])

  const changeColor = useCallback((modeName, colorStr) => {
    track('changeColor', { color: colorStr })
    if (!hoopsViewerRef.current) {
      return
    }

    if (!['wire', 'mesh'].includes(modeName)) {
      throw new Error(`Unsupported HOOPS color change mode: ${modeName}`)
    }

    const hColor = new Communicator.Color(...colorHexStringToRGBArray(colorStr))
    const model = hoopsViewerRef && hoopsViewerRef.current && hoopsViewerRef.current.model

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
    if (!hoopsViewerRef.current) {
      return
    }

    if (hoopsViewerRef && hoopsViewerRef.current && hoopsViewerRef.current.view) {
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
    }
  }, [])

  const changeExplosionMagnitude = useCallback(
    throttle(magnitude => {
      if (!hoopsViewerRef.current) {
        return
      }

      hoopsViewerRef &&
        hoopsViewerRef.current &&
        hoopsViewerRef.current.explodeManager &&
        hoopsViewerRef.current.explodeManager.setMagnitude(magnitude)
    }, 500),
    []
  )

  const changeViewOrientation = useCallback(orientation => {
    track('changeViewOrientation', { orientation })
    hoopsViewerRef &&
      hoopsViewerRef.current &&
      hoopsViewerRef.current.view &&
      hoopsViewerRef.current.view.setViewOrientation(
        Communicator.ViewOrientation[orientation],
        1000
      )
  }, [])

  const getViewerSnapshot = useCallback(fileName => {
    track('getViewerSnapshot')

    if (!hoopsViewerRef.current || !containerRef.current) {
      return
    }

    const canvasSize = hoopsViewerRef.current.view.getCanvasSize()
    const config = new Communicator.SnapshotConfig(
      canvasSize.x,
      canvasSize.y,
      Communicator.SnapshotLayer.Model
    )

    hoopsViewerRef.current.takeSnapshot(config).then(imgElement => {
      let timestamp = new Date().toLocaleString()
      let myCanvasElement = document.createElement('canvas')
      myCanvasElement.width = canvasSize.x
      myCanvasElement.height = canvasSize.y
      let context = myCanvasElement.getContext('2d')
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvasSize.x, canvasSize.y)
      context.drawImage(imgElement, 0, 0, canvasSize.x, canvasSize.y)
      let img = myCanvasElement.toDataURL('image/png')
      let link = document.createElement('a')
      link.download = `${fileName}-${timestamp}.png`
      link.href = img
      link.click()
    })
  }, [])

  const resetImage = useCallback(() => {
    track('resetViewer')
    if (!hoopsViewerRef.current) {
      return
    }

    hoopsViewerRef && hoopsViewerRef.current && hoopsViewerRef.current.reset()
    hoopsViewerRef &&
      hoopsViewerRef.current &&
      hoopsViewerRef.current.model &&
      hoopsViewerRef.current.model.resetNodesColor()
  }, [])

  const highlightPart = useCallback(nodeName => {
    const node = allModelNodes.current.find(node => node.name === nodeName)
    if (node) {
      selectedNodes.current[0] = node.id
      hoopsViewerRef.current.selectionManager.selectNode(node.id)
    } else {
      selectedNodes.current[0] = null
      hoopsViewerRef.current.selectionManager.selectNode(null)

      if (selectedNodes.current[1]) {
        hoopsViewerRef.current.selectionManager.selectNode(selectedNodes.current[1])
      }
    }
  }, [])

  return {
    containerRef,
    hoops: {
      changeColor,
      changeDrawMode,
      changeExplosionMagnitude,
      changeViewOrientation,
      getViewerSnapshot,
      highlightPart,
      resetImage,
      status: hoopsStatus,
    },
  }
}

export default useHoopsViewer
