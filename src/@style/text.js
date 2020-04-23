import { css } from 'styled-components';
import { GREY_5, GREY_11, GREY_12, BLUE_2, WHITE_1, WHITE_3 } from './colors';

export const MONTSERRAT = "'Montserrat', sans-serif";

const LEXEND_DECA = 'Lexend Deca';

export const modelCardHoverText = css`
    font-weight: 500;
    color: ${WHITE_1};
    line-height: 18px;
`;
export const flashToastText = css`
    color: ${WHITE_3};
    line-height: 18px;
`;
export const zeroStateText = css`
    line-height: 18px;
`;
export const bodyCopyText = css`
    line-height: 18px;
`;
export const tabNavigationText = css`
    color: ${GREY_5};
    font-size: 16px;
    line-height: 18px;
`;
export const cardNumbersText = css`
    color: ${GREY_11};
    font-weight: 500;
`;
export const formCalloutText = css`
    line-height: 36px;
    font-size: 18px;
    font-family: ${LEXEND_DECA};
`;
export const usernameText = css`
    font-weight: 500;
    line-height: 36px;
`;
export const subheaderText = css`
    line-height: 36px;
    font-size: 24px;
    font-family: ${LEXEND_DECA};
`;
export const modelTitleText = css`
    font-size: 18px;
    line-height: 36px;
`;
export const pageTitleText = css`
    font-size: 48px;
    line-height: 60px;
    font-family: ${LEXEND_DECA};
`;
export const usernameLinkText = css`
    line-height: 36px;
    font-weight: 500;
    color: ${BLUE_2};
`;
export const linkText = css`
    color: ${BLUE_2};
`;
export const headerText = css`
    line-height: 36px;
    font-size: 32px;
    font-family: ${LEXEND_DECA};
`;
export const logoText = css`
    color: ${GREY_12};
`;
