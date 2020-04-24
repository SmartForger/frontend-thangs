import React, { useState, useEffect } from 'react';

export function ProgressText({ text, className }) {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (dots.length < 3) {
                setDots(`${dots}.`);
            } else {
                setDots('.');
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [dots, setDots]);

    return (
        <div className={className}>
            {text}
            {dots}
        </div>
    );
}
