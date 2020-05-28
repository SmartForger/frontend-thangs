import React from 'react';
import styled from 'styled-components';
import { ModelThumbnail } from './ModelThumbnail';

const Container = styled.div`
    background: white;
    width: 200px;
    height: 200px;
`;

export default {
    title: 'ModelThumbnail',
    component: ModelThumbnail,
};

export function ModelThumbnailLoading() {
    return (
        <Container>
            <ModelThumbnail
                name="Example: Pikachu"
                thumbnailUrl="http://slowwly.robertomurray.co.uk/delay/10000/url/https://i.pinimg.com/originals/76/47/9d/76479dd91dc55c2768ddccfc30a4fbf5.png"
            />
        </Container>
    );
}

export function ModelThumbnailComplete() {
    return (
        <Container>
            <ModelThumbnail
                name="Example: Pikachu"
                thumbnailUrl="https://i.pinimg.com/originals/76/47/9d/76479dd91dc55c2768ddccfc30a4fbf5.png"
            />
        </Container>
    );
}

export function ModelThumbnailError() {
    return (
        <Container>
            <ModelThumbnail name="Example: Pikachu" thumbnailUrl="#" />
        </Container>
    );
}
