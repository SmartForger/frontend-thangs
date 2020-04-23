import { css } from 'styled-components';
import {
    GREY_5,
    GREY_11,
    GREY_12,
    BLUE_2,
    BLACK_1,
    WHITE_1,
    WHITE_2,
    WHITE_3,
    OFF_WHITE,
} from './colors';

export const MONTSERRAT = "'Montserrat', sans-serif";

const LEXEND_DECA = 'Lexend Deca';

export const modelCardHoverText = css`
    font-weight: 500;
    color: ${WHITE_1};
`;
export const flashToastText = css`
    color: ${WHITE_3};
`;
export const zeroStateText = css``;
export const bodyCopyText = css``;
export const tabNavigationText = css`
    color: ${GREY_5};
    font-size: 16px;
    svg {
        fill: ${GREY_5};
    }
`;
export const activeTabNavigationText = css`
    font-size: 16px;
    svg {
        fill: ${BLACK_1};
    }
`;
export const cardNumbersText = css`
    color: ${GREY_11};
    font-weight: 500;
`;
export const formCalloutText = css`
    font-size: 18px;
    font-family: ${LEXEND_DECA};
`;
export const usernameText = css`
    font-weight: 500;
`;
export const subheaderText = css`
    font-size: 24px;
    font-family: ${LEXEND_DECA};
`;
export const modelTitleText = css`
    font-size: 18px;
`;
export const pageTitleText = css`
    font-size: 48px;
    font-family: ${LEXEND_DECA};
`;
export const usernameLinkText = css`
    font-weight: 500;
    text-decoration: none;
    color: ${BLUE_2};
`;
export const linkText = css`
    color: ${BLUE_2};
`;
export const headerText = css`
    font-size: 32px;
    font-family: ${LEXEND_DECA};
`;
export const logoText = css`
    color: ${GREY_12};
`;
export const primaryButtonText = css`
    color: ${WHITE_2};
    font-weight: 500;
`;
export const secondaryButtonText = css`
    color: ${WHITE_1};
    font-weight: 500;
`;
export const darkButtonText = css`
    color: ${OFF_WHITE};
    font-weight: 500;
`;
