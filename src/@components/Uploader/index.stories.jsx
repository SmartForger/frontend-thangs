import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { withApolloProvider } from '../../../.storybook/withApolloProvider';

import { Uploader } from './';

export default {
    title: 'Uploader',
    component: Uploader,
    decorators: [withApolloProvider()],
};

const Button = styled.button`
    margin-top: 32px;
`;

export function UploaderStory() {
    const [file, setFile] = useState();
    const [uploadError, setUploadError] = useState();

    return (
        <div>
            <Uploader showError={!!uploadError} file={file} setFile={setFile} />
            <Button onClick={() => setUploadError({ message: 'upload error' })}>
                Simulate Upload Error
            </Button>
        </div>
    );
}
