import React from 'react';
import styled from 'styled-components';
import { HideOnRoutes } from '@components';

const FooterStyle = styled.div`
    height: 5vh;
    left: 50%;
    margin-left: -12.5vw;
    position: fixed;
    bottom: -1vh;
    background: white;
    border-radius: 20px 20px 0 0;
    z-index: 1;
    text-align: center;
    font-weight: 600;
    padding: 4px 8px 0;
`;
const Footer = ({ children }) => {
    const hide = ['/details', '/profile'];
    return (
        <HideOnRoutes routes={hide}>
            <FooterStyle>
                Feedback? Help us make this the best site for you
            </FooterStyle>
        </HideOnRoutes>
    );
};

export { Footer };
