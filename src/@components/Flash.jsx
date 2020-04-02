import React, { useState } from 'react';
import styled from 'styled-components';

export const Flash = styled.div`
    color: ${props => props.theme.flashColorText};
    background-color: ${props => props.theme.flashColor};
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 48px;
`;

// export const FlashContext = React.createContext({ setFlash });
export const FlashContext = React.createContext([{}, () => {}]);

export const FlashContextProvider = props => {
    const [state, setState] = useState({});
    return (
        <FlashContext.Provider value={[state, setState]}>
            {props.children}
        </FlashContext.Provider>
    );
};
