import React from 'react';
import styled from 'styled-components';
import { AnchorButton } from '@components/AnchorButton';
import { ColorPicker } from '@components/ColorPicker';
import { TextButton } from '@components/Button';

import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg';
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg';
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg';
import { ReactComponent as EdgesColor } from '@svg/view-color-edges.svg';
import { ReactComponent as ShadeColor } from '@svg/view-color-shade.svg';
import { viewerToolbarText } from '@style/text';
import { WHITE_1, GREY_1 } from '@style/colors';
import { mediaMdPlus } from '@style/media-queries';

const IconButton = styled(TextButton)`
    height: 36px;
    ${mediaMdPlus} {
        margin-left: 16px;
    }
`;

const ToolbarContainer = styled.div`
    position: relative;
    background-color: ${WHITE_1};
    box-shadow: none;
    border-top: 1px solid ${GREY_1};
    padding: 24px;

    display: flex;
    justify-content: space-between;
`;

const ToolGroup = styled.div`
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;

    > button + button {
        margin-left: 12px;
    }
`;

const ToolGroupTitle = styled.div`
    ${viewerToolbarText};
    display: none;
    text-transform: uppercase;
    margin: 0;
    padding: 0;

    ${mediaMdPlus} {
        display: block;
    }
`;

export function Toolbar({
    onResetView,
    onDrawModeChange,
    onColorChange,
    meshColor,
    wireColor,
}) {
    const makeDrawModeHandler = modeName => () => {
        onDrawModeChange(modeName);
    };

    const makeColorHandler = modeName => color => {
        onColorChange(modeName, color);
    };

    return (
        <ToolbarContainer>
            <ToolGroup>
                <ToolGroupTitle>Model View</ToolGroupTitle>
                <IconButton onClick={makeDrawModeHandler('shaded')}>
                    <ShadedMode />
                </IconButton>
                <IconButton onClick={makeDrawModeHandler('wire')}>
                    <WireMode />
                </IconButton>
                <IconButton onClick={makeDrawModeHandler('xray')}>
                    <XRayMode />
                </IconButton>
            </ToolGroup>
            <ToolGroup>
                <ToolGroupTitle>Change Color</ToolGroupTitle>
                <IconButton>
                    <ColorPicker
                        color={wireColor}
                        onChange={makeColorHandler('wire')}
                    >
                        <EdgesColor />
                    </ColorPicker>
                </IconButton>
                <IconButton>
                    <ColorPicker
                        color={meshColor}
                        onChange={makeColorHandler('mesh')}
                    >
                        <ShadeColor />
                    </ColorPicker>
                </IconButton>
            </ToolGroup>
            <AnchorButton
                onClick={onResetView}
                css={`
                    ${mediaMdPlus} {
                        display: none;
                    }
                `}
            >
                Reset
            </AnchorButton>
            <AnchorButton
                onClick={onResetView}
                css={`
                    display: none;
                    ${mediaMdPlus} {
                        display: block;
                    }
                `}
            >
                Reset Image
            </AnchorButton>
        </ToolbarContainer>
    );
}
