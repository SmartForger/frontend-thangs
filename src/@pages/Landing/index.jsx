import React, { useContext } from 'react';
import styled from 'styled-components';

import { WithNewInvertedHeaderLayout } from '@style/Layout';

const Body = styled.div`
    height: 2000px;
`;
function Page() {
    return (
        <div>
            <Body />
        </div>
    );
}

const Landing = WithNewInvertedHeaderLayout(Page);

export { Landing };
