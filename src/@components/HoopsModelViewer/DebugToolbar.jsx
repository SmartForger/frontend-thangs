import React, { useCallback } from 'react'
import { createUseStyles } from '@style'
import { ReactComponent as HeartIcon } from '@svg/dropdown-heart.svg'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as CalendarIcon } from '@svg/icon-calendar.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import classNames from 'classnames'

// toolbarCuttingplaneX: {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -257px',
// },

// .toolbar-cuttingplane-y {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -215px',
// }

// .toolbar-cuttingplane-z {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -173px',
// }

// .toolbar-cuttingplane-face {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -47px',
// }

// .toolbar-cuttingplane-section {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -341px',
// }

// .toolbar-cuttingplane-toggle {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -299px',
// }

// .toolbar-cuttingplane-reset {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -341px',
// }

// .toolbar-explode {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -47px',
// }

// .toolbar-explode.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -47px',
// }

// .toolbar-face {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -47px',
// }

// .toolbar-face.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -47px',
// }

// .toolbar-front {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -47px',
// }

// .toolbar-front.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -47px',
// }

// .toolbar-hidden-line {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-5px -89px',
// }

// .toolbar-hidden-line.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-47px -89px',
// }

// .toolbar-home {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -89px',
// }

// .toolbar-home.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -89px',
// }

// .toolbar-iso {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -89px',
// }

// .toolbar-iso.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -89px',
// }

// .toolbar-left {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -89px',
// }

// .toolbar-left.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -89px',
// }

// .toolbar-measure-angle {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-5px -131px',
// }

// .toolbar-measure-angle.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-47px -131px',
// }

// .toolbar-measure-distance {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -131px',
// }

// .toolbar-measure-distance.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -131px',
// }

// .toolbarMeasureEdge {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -131px',
// }

// .toolbarMeasureEdge.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -131px',
// }

// .toolbarMeasurePoint {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -131px',
// }

// .toolbarMeasurePoint.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -131px',
// }

// .toolbarNote {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-5px -173px',
// }

// .toolbarNote.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-47px -173px',
// }

// .toolbarOrbit {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -173px',
// }

// .toolbarOrbit.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -173px',
// }

// .toolbarOrtho {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -173px',
// }

// .toolbarOrtho.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -173px',
// }

// .toolbarPersp {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -173px',
// }

// .toolbarPersp.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -173px',
// }

// .toolbarRedlineCircle {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-5px -215px',
// }

// .toolbarRedlineCircle.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-47px -215px',
// }

// .toolbarRedlineFreehand {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -215px',
// }

// .toolbarRedlineFreehand.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -215px',
// }

// .toolbarRedlineNote {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -215px',
// }

// .toolbarRedlineNote.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -215px',
// }

// .toolbarRedlineRectangle {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -215px',
// }

// .toolbar-redline-rectangle.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -215px',
// }

// .toolbarRight {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-5px -257px',
// }

// .toolbarRight.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-47px -257px',
// }

// .toolbarSelect {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -257px',
// }

// .toolbarSelect.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -257px',
// }

// .toolbarArea-select {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -341px',
// }

// .toolbarSettings {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -257px',
// }

// .toolbarSettings.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -257px',
// }

// .toolbarShaded {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -257px',
// }

// .toolbarShaded.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -257px',
// }

// .toolbarSnapshot {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-5px -299px',
// }

// .toolbar-snapshot.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-47px -299px',
// }

// .toolbarTop {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-89px -299px',
// }

// .toolbarTop.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-131px -299px',
// }

// .toolbarTurntable {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-173px -299px',
// }

// .toolbarWurntable.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-215px -299px',
// }

// .toolbarWalk {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-257px -299px',
// }

// .toolbarWalk.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-299px -299px',
// }

// .toolbarWireframe {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -5px',
// }

// .toolbarWireframe.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -47px',
// }

// .toolbarWireframeshaded {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -89px',
// }

// .toolbarWireframeshaded.hover {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -131px',
// }

// .toolbarXray {
//     width: 32,
//     height: 32,
//     backgroundPosition: '-341px -5px',

//     /* Temporary style to differentiate between the xray and wireframe icon */
//     background-color: lightgrey;
// }

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    toolbarTools: {
      background: 'rgba(255,255,255,1.0)',
      border: '1px solid black',
      borderRadius: '6px',
      margin: '0',
      padding: '0',
      height: '42px',
      opacity: 0.6,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    hoopsTool: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTool: {
      borderRadius: 1,
      borderColor: '#888888',
      borderStyle: 'solid',
      borderWidth: 1,
      margin: 4,
      boxShadow: '0px 0px 6px #888888',
    },
  }
})

const Toolbar = ({ children }) => {
  const c = useStyles()
  return <div className={c.toolbarTools}>{children}</div>
}

const ToolbarTool = props => {
  let { tool, title, children, onClick } = props
  const c = useStyles()
  return (
    <div id={tool} title={title} className={c.hoopsTool} onClick={onClick}>
      {children}
    </div>
  )
}

const DebugToolbar = ({ onHandleViewOrientation }) => {
  const makeNewValueOrientationHandler = useCallback(
    orientation => () => {
      onHandleViewOrientation(orientation)
    },
    [onHandleViewOrientation]
  )
  const c = useStyles()
  return (
    <Toolbar>
      <ToolbarTool
        tool='home-button'
        title='Front View'
        onClick={makeNewValueOrientationHandler('Front')}
      >
        <HeartIcon />
      </ToolbarTool>

      <ToolbarTool
        tool='view-button'
        title='Back View'
        onClick={makeNewValueOrientationHandler('Back')}
      >
        <DownloadIcon />
      </ToolbarTool>
      <ToolbarTool
        tool='edgeface-button'
        title='Right View'
        onClick={makeNewValueOrientationHandler('Right')}
      >
        <PlusIcon />
      </ToolbarTool>

      <ToolbarTool
        tool='camera-button'
        title='Left View'
        onClick={makeNewValueOrientationHandler('Left')}
      >
        <UploadIcon />
      </ToolbarTool>
      <div
        id='explode-button'
        title='Explode Menu'
        className='hoops-tool toolbar-menu-toggle'
      >
        <div className={c.toolIcon}></div>
      </div>
      <div
        id='cuttingplane-button'
        title='Cutting Plane Menu'
        className='hoops-tool toolbar-menu-toggle'
      >
        <div className={c.toolIcon}></div>
      </div>
      <div id='snapshot-button' title='Snapshot' className={c.hoopsTool}>
        <div className={c.toolIcon}></div>
      </div>
      <div id='settings-button' title='Settings' className={c.hoopsTool}>
        <div className={c.toolIcon}></div>
      </div>

      <div id='submenus'>
        <div id='redline-submenu' className='toolbar-submenu submenus'>
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id='redline-circle-button'
                    title='Redline Circle'
                    className={c.submenuIcon}
                  ></div>
                </td>
                <td>
                  <div
                    id='redline-rectangle-button'
                    title='Redline Rectangle'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='redline-note'
                    title='Redline Note'
                    className={c.submenuIcon}
                  ></div>
                </td>
                <td>
                  <div
                    id='redline-freehand'
                    title='Redline Freehand'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='camera-submenu' className='toolbar-submenu submenus'>
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id='operator-camera-walk'
                    title='Walk'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='operator-camera-turntable'
                    title='Turntable'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='operator-camera-orbit'
                    title='Orbit Camera'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='edgeface-submenu' className='toolbar-submenu submenus'>
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id='viewport-wireframe-on-shaded'
                    title='Shaded With Lines'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='viewport-shaded'
                    title='Shaded'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div title='Hidden Line' className={c.submenuIcon}></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='viewport-wireframe'
                    title='Wireframe'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id='viewport-xray' title='XRay' className={c.submenuIcon}></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='view-submenu' className='toolbar-submenu submenus'>
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id='view-face'
                    title='Orient Camera To Selected Face'
                    className='submenu-icon disabled'
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id='view-iso' title='Iso View' className={c.submenuIcon}></div>
                </td>
                <td>
                  <div
                    id='view-ortho'
                    title='Orthographic Projection'
                    className={c.submenuIcon}
                  ></div>
                </td>
                <td>
                  <div
                    id='view-persp'
                    title='Perspective Projection'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id='view-left' title='Left View' className={c.submenuIcon}></div>
                </td>
                <td>
                  <div id='view-right' title='Right View' className={c.submenuIcon}></div>
                </td>
                <td>
                  <div
                    id='view-bottom'
                    title='Bottom View'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id='view-front' title='Front View' className={c.submenuIcon}></div>
                </td>
                <td>
                  <div id='view-back' title='Back View' className={c.submenuIcon}></div>
                </td>
                <td>
                  <div id='view-top' title='Top View' className={c.submenuIcon}></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='click-submenu' className='toolbar-submenu submenus'>
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id='note-button'
                    title='Create Note-Pin'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='measure-angle-between-faces'
                    title='Measure Angle Between Faces'
                    className={c.submenuIcon}
                  ></div>
                </td>
                <td>
                  <div
                    id='measure-distance-between-faces'
                    title='Measure Distance Between Faces'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='measure-edges'
                    title='Measure Edges'
                    className={c.submenuIcon}
                  ></div>
                </td>
                <td>
                  <div
                    id='measure-point-to-point'
                    title='Measure Point to Point'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='select-parts'
                    title='Select Parts'
                    className={c.submenuIcon}
                  ></div>
                </td>
                <td>
                  <div
                    id='area-select'
                    title='Area Select'
                    className={c.submenuIcon}
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='explode-slider' className='toolbar-submenu slider-menu submenus'>
          <div id='explosion-slider' className={c.toolbarSlider}></div>
        </div>
        <div
          id='cuttingplane-submenu'
          className='toolbar-submenu cutting-plane submenus no-modal'
        >
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    id='cuttingplane-face'
                    title='Create Cutting Plane On Selected Face'
                    className='toolbar-cp-plane submenu-icon disabled'
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='cuttingplane-x'
                    title='Cutting Plane X'
                    className='toolbar-cp-plane submenu-icon'
                  ></div>
                </td>
                <td>
                  <div
                    id='cuttingplane-section'
                    title='Cutting Plane Visibility Toggle'
                    className='toolbar-cp-plane submenu-icon disabled'
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='cuttingplane-y'
                    title='Cutting Plane Y'
                    className='toolbar-cp-plane submenu-icon'
                  ></div>
                </td>
                <td>
                  <div
                    id='cuttingplane-toggle'
                    title='Cutting Plane Section Toggle'
                    className='toolbar-cp-plane submenu-icon disabled'
                  ></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    id='cuttingplane-z'
                    title='Cutting Plane Z'
                    data-plane='z'
                    className='toolbar-cp-plane submenu-icon'
                  ></div>
                </td>
                <td>
                  <div
                    id='cuttingplane-reset'
                    title='Cutting Plane Reset'
                    className='toolbar-cp-plane submenu-icon disabled'
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Toolbar>
  )
}

export default DebugToolbar
