import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UploadFrame } from '@components/UploadFrame';
import { ReactComponent as CheckUploadingIcon } from '@svg/check-uploading-icon.svg';
import { ReactComponent as LensUploadingIcon } from '@svg/lens-uploading-icon.svg';
import { ReactComponent as GraphUploadingIcon } from '@svg/graph-uploading-icon.svg';
import { ReactComponent as RulerUploadingIcon } from '@svg/ruler-uploading-icon.svg';
import { ReactComponent as ProtractorUploadingIcon } from '@svg/protractor-uploading-icon.svg';

const DotsContainer = styled.div`
    margin-bottom: 160px;
    width: 250px;
`;

function Dots() {
    const [dots, setDots] = useState('.');
    useEffect(
        () => {
            setTimeout(() => {
                if (dots.length < 3) {
                    setDots(`${dots}.`);
                } else {
                    setDots('.');
                }
            }, 500);
        },
        [dots, setDots],
    );
    return <DotsContainer>Searching matches{dots}</DotsContainer>;
}

const CHECK = 'check';
const LENS = 'lens';
const GRAPH = 'graph';
const RULER = 'ruler';
const PROTRACTOR = 'protractor';

const IconContainer = styled.div`
    margin-top: 152px;
`;

function Icons() {
    const [icon, setIcon] = useState(CHECK);
    useEffect(
        () => {
            const timeout = setTimeout(() => {
                if (icon === CHECK) {
                    setIcon(LENS);
                } else if (icon === LENS) {
                    setIcon(GRAPH);
                } else if (icon === GRAPH) {
                    setIcon(RULER);
                } else if (icon === RULER) {
                    setIcon(PROTRACTOR);
                } else if (icon === PROTRACTOR) {
                    setIcon(LENS);
                }
            }, 1000);
            return () => clearTimeout(timeout);
        },
        [icon, setIcon],
    );

    return (
        <IconContainer>
            {icon === CHECK ? (
                <CheckUploadingIcon />
            ) : icon === LENS ? (
                <LensUploadingIcon />
            ) : icon === GRAPH ? (
                <GraphUploadingIcon />
            ) : icon === RULER ? (
                <RulerUploadingIcon />
            ) : (
                <ProtractorUploadingIcon />
            )}
        </IconContainer>
    );
}

export function UploadProgress() {
    return (
        <UploadFrame
            css={`
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            `}
        >
            <Icons />
            <Dots />
        </UploadFrame>
    );
}
