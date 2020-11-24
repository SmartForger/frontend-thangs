import React, { useCallback } from 'react';
import { createUseStyles } from '@style';
import { ReactComponent as HeartIcon } from '@svg/dropdown-heart.svg'
import { ReactComponent as DownloadIcon } from '@svg/notification-downloaded.svg'
import { ReactComponent as CalendarIcon } from '@svg/icon-calendar.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'


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
            alignItems: 'center'
        },
        hoopsTool: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        activeTool: {
            borderRadius: 1,
            borderColor: '#888888',
            borderStyle: 'solid',
            borderWidth: 1,
            margin: 4,
            boxShadow: '0px 0px 6px #888888',
        }
    }
});

const Toolbar = ({ children }) => {
    const c = useStyles();
    return (
        <div className={c.toolbarTools}>
            {children}
        </div>
    )
}


const ToolbarTool = (props) => {
    let { title, children, onClick } = props
    const c = useStyles();
    return (<div title={title} className={c.hoopsTool} onClick={onClick}>
        {children}
    </div>)
}

const DebugToolbar = ({
    onChangeViewOrientation,
    onGetViewerSnapshot,
    modelName
}) => {
    const changeOrientationHandler = useCallback(
        orientation => () => {
            onChangeViewOrientation(orientation)
        },
        [onChangeViewOrientation]
    )

    const getViewerSnapshotHandler = useCallback(
        (fileName) => () => {
            onGetViewerSnapshot(fileName);
        },
        [onGetViewerSnapshot]
    )
    const c = useStyles();
    return (
        <Toolbar>
            <ToolbarTool title="Front View" onClick={changeOrientationHandler('Front')}>
                <HeartIcon />
            </ToolbarTool>

            <ToolbarTool title="Back View" onClick={changeOrientationHandler('Back')} >
                <DownloadIcon />
            </ToolbarTool>
            <ToolbarTool title="Right View" onClick={changeOrientationHandler('Right')}>
                <PlusIcon />
            </ToolbarTool>

            <ToolbarTool title="Left View" onClick={changeOrientationHandler('Left')}>
                <UploadIcon />
            </ToolbarTool>
            <ToolbarTool title="Take Snapshot" onClick={getViewerSnapshotHandler(modelName)}>
                <ErrorIcon />
            </ToolbarTool>
        </Toolbar>
    )
}

export default DebugToolbar;