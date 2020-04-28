import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const allowCssProp = props => (props.css ? props.css : '');

const Text = styled.div`
    text-align: left;
    ${allowCssProp};
`;

export function ProgressText({ text, className, css }) {
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
        <Text className={className} css={css}>
            {text}
            {dots}
        </Text>
    );
}
