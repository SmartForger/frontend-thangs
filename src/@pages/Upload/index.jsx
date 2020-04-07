import React from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style';

const Page = () => {
    return <div>Hello World</div>;
};

const Upload = WithNewThemeLayout(Page);

export { Upload };
