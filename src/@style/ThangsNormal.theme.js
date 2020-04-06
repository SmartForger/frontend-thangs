export const ThangsMain = {
    primary: '#F7BB3D',
    secondary: '#0D0D0D',
    white: '#FFFFFF',
    grey: '#D9D9D9',
    darkgrey: '#999999',
    mainFont: 'Raleway, sans-serif',
    pageWidth: '1012px',
    headerHeight: '64px',
};

/*
 * These colors are commented out for now to avoid unused variable errors in
 * our build. That is because we haven't placed in the theme yet, but they are
 * present in our designer's palette and we should account for them.
 */
const OFF_WHITE = '#f5f5f5';
const GREY_1 = '#dbdbdf';
// const GREY_2 = '#d9d9d9';
const GREY_3 = '#b9b9be';
const GREY_4 = '#989898';
const GREY_5 = '#88888b';
// const GREY_6 = '#7a7a7a';
const GREY_7 = '#616168';
const GREY_8 = '#e6e6e9';
const GREY_9 = '#b9b9be';
const GREY_10 = '#bfbfbf';
const BLACK_1 = '#515151';
const BLACK_2 = '#232530';
// const BLACK_3 = '#231f20';
const BLACK_4 = '#464655';
const BLACK_5 = '#4a4a4a';
const YELLOW_1 = '#ffbc00';
// const YELLOW_2 = '#cd9602';
// const YELLOW_3 = '#b18002';
// const BLUE_1 = '#1cb2f5';
const BLUE_2 = '#1b8cf8';
// const BLUE_3 = '#014d7c';
// const BLUE_4 = '#013047';
const BROWN = '#8b6400';
const WHITE_1 = '#ffffff';
const WHITE_2 = '#efecec';
const WHITE_3 = '#e8e8ec';

/*
 * These will be the fonts we actually want to use, but we need to get them from
 * our designer before we can use them.
 */
// const fontMedium = 'Montserrat-Medium';
// const fontMain = 'Montserrat-regular;';
const fontMedium = 'helvetica';
const fontMain = 'helvetica';

const shadow = 'box-shadow: 0px 5px 10px 0px rgba(35, 37, 48, 0.25)';

export const NewTheme = {
    logoText: BLACK_4,
    linkText: BLUE_2,
    brandColor: YELLOW_1,
    searchIconColor: GREY_5,
    deleteButton: GREY_7,
    primaryButton: BLUE_2,
    secondaryButton: GREY_9,
    secondaryButtonText: WHITE_1,
    primaryButtonText: WHITE_2,
    searchText: GREY_4,
    searchBackground: WHITE_1,
    textOnBrandColor: BROWN,
    emptyImageBackground: GREY_7,
    cardBackground: WHITE_1,
    modelThumbnailPlaceholder: OFF_WHITE,
    modelViewerPlaceholder: OFF_WHITE,
    activityCount: GREY_3,
    buttonFont: fontMedium,
    mainFont: fontMain,
    mainFontColor: BLACK_5,
    backgroundColor: GREY_8,
    profileNameColor: BLACK_5,
    profileContentColor: BLACK_5,
    selectedProfileTabColor: BLACK_1,
    unselectedProfileTabColor: GREY_5,
    cardHeartColor: BLUE_2,
    modelDetailLabel: GREY_5,
    flashColor: GREY_5,
    flashColorText: WHITE_3,
    shadow,
    modelActionButtonText: WHITE_1,
    modelActionButtonBackground: GREY_3,
    modelPrimaryButtonBackground: BLUE_2,
    modelPrimaryButtonText: WHITE_2,
    avatarTextColor: GREY_1,
    invertedHeaderBackground: BLACK_2,
    promotionalTextColor: WHITE_1,
    promotionalSecondaryTextColor: GREY_3,
    modelTitleText: BLACK_1,
    modelOwnerLink: BLUE_2,
    avatarInitialsColor: GREY_10,
};
