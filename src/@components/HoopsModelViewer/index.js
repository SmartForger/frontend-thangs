import { lazy } from 'react'
export const HoopsModelViewer = lazy(() =>
  import(/* webpackChunkName: 'model-viewer' */ './ModelViewer')
)
