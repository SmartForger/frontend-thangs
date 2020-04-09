import React, { useState, useEffect } from 'react';
import { UploadFrame } from '@components/UploadFrame';
import { ReactComponent as CheckUploadingIcon } from '@svg/check-uploading-icon.svg';
import { ReactComponent as LensUploadingIcon } from '@svg/lens-uploading-icon.svg';
import { ReactComponent as GraphUploadingIcon } from '@svg/graph-uploading-icon.svg';
import { ReactComponent as RulerUploadingIcon } from '@svg/ruler-uploading-icon.svg';
import { ReactComponent as ProtractorUploadingIcon } from '@svg/protractor-uploading-icon.svg';

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
    return <div>Searching matches{dots}</div>;
}

const CHECK = 'check';
const LENS = 'lens';
const GRAPH = 'graph';
const RULER = 'ruler';
const PROTRACTOR = 'protractor';

function Icons() {
    const [icon, setIcon] = useState('check');
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
    if (icon === CHECK) {
        return <CheckUploadingIcon />;
    } else if (icon === LENS) {
        return <LensUploadingIcon />;
    } else if (icon === GRAPH) {
        return <GraphUploadingIcon />;
    } else if (icon === RULER) {
        return <RulerUploadingIcon />;
    } else if (icon === PROTRACTOR) {
        return <ProtractorUploadingIcon />;
    }
}

export function UploadProgress() {
    return (
        <UploadFrame>
            <Dots />
            <Icons />
        </UploadFrame>
    );
}
