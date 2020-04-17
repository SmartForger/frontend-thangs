import React from 'react';
import styled from 'styled-components';
import { AnchorButton } from '@components/AnchorButton';

import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg';
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg';
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg';
import { ReactComponent as EdgesColor } from '@svg/view-color-edges.svg';
import { ReactComponent as ShadeColor } from '@svg/view-color-shade.svg';

const ToolbarContainer = styled.div`
    background-color: #ffffff;
    box-shadow: none;
    border-radius: 0 0 5px 5px;
    border-top: 1px solid #eeeeee;
    padding: 24px;

    display: flex;
    justify-content: space-between;

    color: rgb(152, 152, 152);
    font-size: 12px;
    font-weight: 500;
`;

const ToolGroup = styled.div`
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
`;

const ToolGroupTitle = styled.div`
    text-transform: uppercase;
    margin: 0;
    padding: 0;
`;

const ToolButton = styled.button`
    margin-left: 16px;
    padding: 0;
    border: none;
    background: none;
    text-decoration: none;
    cursor: pointer;
`;

const ResetButton = styled(AnchorButton)`
    font-weight: 500;
    font-size: 14px;
`;

export function Toolbar({ onResetView, onDrawModeChange, onColorChange }) {
    const makeDrawModeHandler = modeName => () => {
        onDrawModeChange(modeName);
    };

    const makeColorHandler = (modeName, color) => () => {
        onColorChange(modeName, color);
    };

    return (
        <ToolbarContainer>
            <ToolGroup>
                <ToolGroupTitle>Model View</ToolGroupTitle>
                <ToolButton onClick={makeDrawModeHandler('shaded')}>
                    <ShadedMode />
                </ToolButton>
                <ToolButton onClick={makeDrawModeHandler('wire')}>
                    <WireMode />
                </ToolButton>
                <ToolButton onClick={makeDrawModeHandler('xray')}>
                    <XRayMode />
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolGroupTitle>Change Color</ToolGroupTitle>
                <ToolButton onClick={makeColorHandler('edges', 'red')}>
                    <EdgesColor />
                </ToolButton>
                <ToolButton onClick={makeColorHandler('shade', 'blue')}>
                    <ShadeColor />
                </ToolButton>
            </ToolGroup>
            <ResetButton onClick={onResetView}>Reset Image</ResetButton>
        </ToolbarContainer>
    );
}
