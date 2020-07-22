import React from 'react';
import styled from 'styled-components';
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg';
import { BLUE_2 } from '@style/colors';
import { WHITE_2 } from '@style/colors';

const VersionIconStyled = styled(VersionIcon)`
    display: block;
    margin: auto;
    fill: ${WHITE_2} !important;
   
`;

const IconContainer = styled.div`
    display: flex;
    background-color: ${BLUE_2};
    width: 48px;
    height: 48px;
    border-radius: 100%;
    margin-right: 16px;
`;

export function VersionPicture() {
    return (
        <IconContainer>
            <VersionIconStyled />
        </IconContainer>
    );
}
