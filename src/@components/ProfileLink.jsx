import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { linkText } from '@style/text';

const ProfileLinkStyled = styled(Link)`
    ${linkText};
    display: block;
    text-decoration: none;
`;

export function ProfileLink({ children, ...props }) {
    return (
        <ProfileLinkStyled {...props}>
            {children}
        </ProfileLinkStyled>
    );
}
