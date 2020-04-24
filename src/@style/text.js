import { css } from 'styled-components';
import {
    GREY_3,
    GREY_4,
    GREY_5,
    GREY_6,
    GREY_11,
    GREY_12,
    BLUE_2,
    BLACK_1,
    BLACK_5,
    BROWN,
    RED_4,
    WHITE_1,
    WHITE_2,
    WHITE_3,
    OFF_WHITE,
    YELLOW_1,
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
export const profileAboutText = css`
    font-size: 16px;
    color: ${BLACK_5};
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
export const resultsHeaderText = css`
    font-size: 24px;
    font-family: ${LEXEND_DECA};
    color: BLACK_5;
`;
export const modelTitleText = css`
    font-size: 18px;
`;
export const pageTitleText = css`
    font-size: 48px;
    font-family: ${LEXEND_DECA};
`;
export const darkPageTitleText = css`
    ${pageTitleText};
    color: ${WHITE_1};
`;
export const linkText = css`
    font-weight: 500;
    text-decoration: none;
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

    > svg {
        fill: ${WHITE_1};
    }
`;
export const darkButtonText = css`
    color: ${OFF_WHITE};
    font-weight: 500;
`;
export const smallInfoMessageText = css`
    line-height: 18px;
    font-style: italic;
    color: ${GREY_5};
`;
export const infoMessageText = css`
    font-size: 24px;
    font-style: normal;
    line-height: 28px;
    color: ${GREY_3};
`;
export const modelDetailsLabelText = css`
    font-size: 12px;
    font-weight: 600;
    color: ${GREY_5};
`;
export const inputPlaceholderText = css`
    color: ${GREY_5};
`;
export const landingPageText = css`
    color: ${WHITE_1};
    text-decoration-color: ${YELLOW_1};
    font-size: 72px;
`;
export const landingPageSubtext = css`
    color: ${GREY_3};
    font-size: 32px;
    font-weight: 300;
`;
export const matchingSubheader = css`
    font-size: 18px;
    color: ${GREY_5};
`;
export const viewerToolbarText = css`
    color: ${GREY_4}
    font-size: 12px;
    font-weight: 500;
`;
export const viewerLoadingText = css`
    font-weight: 500;
    font-size: 16px;
`;
export const formSuccessText = css`
    color: green;
`;
export const formErrorText = css`
    color: ${RED_4};
    font-weight: 500;
`;
export const matchingButtonText = css`
    color: ${BROWN};
`;
export const thumbnailErrorText = css`
    color: ${GREY_3};
    font-weight: 500;
`;
export const thumbnailActivityCountText = css`
    color: ${GREY_3};
    font-weight: 500;
`;
export const zeroStateText = css`
    color: ${GREY_6};
`;
export const darkFormText = css`
    color: ${GREY_4};
`;
