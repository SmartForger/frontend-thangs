import React, { useContext } from 'react';

import { WithNewInvertedHeaderLayout } from '@style/Layout';

function Page() {
    return <div>Hello World</div>;
}

const Landing = WithNewInvertedHeaderLayout(Page);

export { Landing };
