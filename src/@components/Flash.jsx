import React, { useState } from 'react';
import styled from 'styled-components';
import { flashToastText } from '@style/text';

export const Flash = styled.div`
    ${flashToastText};
    background-color: ${props => props.theme.flashColor};
    border-radius: 8px;
    padding: 16px 24px;
    margin-bottom: 48px;
`;

const NOOP = () => null;

export const FlashContext = React.createContext([null, NOOP]);

export const FlashContextProvider = props => {
    const [state, setState] = useState();
    return (
        <FlashContext.Provider value={[state, setState]}>
            {props.children}
        </FlashContext.Provider>
    );
};
