import React, { useState } from 'react';
import styled from 'styled-components';

const ProfilePicStyled = styled.div`
    background: grey;
    border-radius: 50%;
    height: 250px;
    width: 250px;
    cursor: pointer;
`;

const HiddenInput = styled.input`
    visibility: hidden;
    position: absolute;
`;

export function ChangeablePicture() {
    return (
        <form>
            <label htmlFor="avatar">
                <ProfilePicStyled />
            </label>
            <HiddenInput type="file" name="Change Image" id="avatar" />
        </form>
    );
}
