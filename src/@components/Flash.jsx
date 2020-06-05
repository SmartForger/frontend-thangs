import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { flashToastText } from '@style/text';

export const Flash = styled.div`
    ${flashToastText};
    background-color: ${props => props.theme.flashColor};
    border-radius: 8px;
    padding: 16px 24px;
    margin-bottom: 24px;
`;

export const FlashContext = React.createContext([null, {}]);

export const FlashContextProvider = props => {
    const history = useHistory();
    const [flash, setFlash] = useState();
    const navigateWithFlash = (to, msg) => {
        history.push(to);
        setTimeout(() => setFlash(msg), 0);
    };

    return (
        <FlashContext.Provider value={[flash, { setFlash, navigateWithFlash }]}>
            {props.children}
        </FlashContext.Provider>
    );
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function WithFlash({ children }) {
    const [flash, { setFlash }] = useContext(FlashContext);

    useEffect(() => {
        async function clearFlash() {
            await sleep(5000);
            setFlash();
        }
        clearFlash();

        return function cleanup() {
            setFlash();
        };
    }, [setFlash]);

    return (
        <>
            {flash && <Flash>{flash}</Flash>}
            {children}
        </>
    );
}
