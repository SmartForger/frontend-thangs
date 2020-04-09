import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as UploadIcon } from '@svg/upload-icon.svg';
import { UploadFrame } from '@components/UploadFrame';

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

export function UploadProgress() {
    return (
        <UploadFrame>
            <Dots />
        </UploadFrame>
    );
}
