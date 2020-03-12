import React from 'react';
import styled from 'styled-components';

const Name = ({ name }) => {
    return <div>Name: {name}</div>;
};

const Likes = ({ likes }) => {
    const amount = likes.filter(fields => fields.isLiked).length;
    return <div>Likes: {amount}</div>;
};

const Owner = ({ owner }) => {
    return (
        <div>
            Created by: {owner.firstName} {owner.lastName}
        </div>
    );
};

const ModelPage = ({ model }) => {
    return (
        <div>
            <Name name={model.name} />
            <Owner owner={model.owner} />
            <Likes likes={model.likes} />
        </div>
    );
};

export { ModelPage };
