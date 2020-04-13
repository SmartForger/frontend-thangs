/*
 * These colors are commented out for now to avoid unused variable errors in
 * our build. That is because we haven't placed in the theme yet, but they are
 * present in our designer's palette and we should account for them.
 */
const OFF_WHITE = '#f5f5f5';
const GREY_1 = '#dbdbdf';
const GREY_2 = '#d9d9d9';
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
const BLACK_3 = '#231f20';
const BLACK_4 = '#464655';
const BLACK_5 = '#4a4a4a';
const YELLOW_1 = '#ffbc00';
// const YELLOW_2 = '#cd9602';
// const YELLOW_3 = '#b18002';
const BLUE_1 = '#1cb2f5';
const BLUE_2 = '#1b8cf8';
const BLUE_3 = '#014d7c';
// const BLUE_4 = '#013047';
const BROWN = '#8b6400';
const WHITE_1 = '#ffffff';
const WHITE_2 = '#efecec';
const WHITE_3 = '#e8e8ec';
const WHITE_4 = '#ececec';
const LIGHT_PURPLE = '#dd72dd';

/*
 * These will be the fonts we actually want to use, but we need to get them from
 * our designer before we can use them.
 */
const fontMedium = "'Montserrat', sans-serif";
const fontMain = "'Montserrat', sans-serif";
const shadow = 'box-shadow: 0px 5px 10px 0px rgba(35, 37, 48, 0.25)';
const headerFont = 'Lexend Deca';

export const NewTheme = {
    activityCount: GREY_3,
    avatarInitialsColor: GREY_10,
    avatarTextColor: GREY_1,
    backgroundColor: GREY_8,
    brandColor: YELLOW_1,
    buttonFont: fontMedium,
    buttonShadow: 'inset 0 0 0 2px #FFFFFF',
    cardBackground: WHITE_1,
    cardHeartColor: BLUE_2,
    deleteButton: GREY_7,
    emptyImageBackground: GREY_7,
    flashColor: GREY_5,
    flashColorText: WHITE_3,
    formLabelColor: GREY_4,
    invertedHeaderBackground: BLACK_2,
    headerFont,
    headerColor: BLACK_3,
    headerColorOnDarkBackground: WHITE_1,
    linkText: BLUE_2,
    linkTextVisited: BLUE_3,
    logoText: BLACK_4,
    mainFont: fontMain,
    mainFontColor: BLACK_5,
    modelActionButtonBackground: GREY_3,
    modelActionButtonText: WHITE_1,
    modelDetailLabel: GREY_5,
    modelOwnerLink: BLUE_2,
    modelPrimaryButtonBackground: BLUE_2,
    modelPrimaryButtonText: WHITE_2,
    modelThumbnailPlaceholder: OFF_WHITE,
    modelTitleText: BLACK_1,
    modelViewerPlaceholder: OFF_WHITE,
    primaryButton: BLUE_2,
    primaryButtonText: WHITE_2,
    profileContentColor: BLACK_5,
    profileNameColor: BLACK_5,
    promotionalSecondaryTextColor: GREY_3,
    promotionalTextColor: WHITE_1,
    searchBackground: WHITE_1,
    searchIconColor: GREY_5,
    searchText: GREY_4,
    secondaryButton: GREY_9,
    secondaryButtonText: WHITE_1,
    selectedProfileTabColor: BLACK_1,
    shadow,
    textColorOnDarkBackground: GREY_4,
    textOnBrandColor: BROWN,
    textInputBackground: WHITE_4,
    textInputColor: BLACK_1,
    textInputPlaceholderColor: GREY_4,
    unselectedProfileTabColor: GREY_5,
    uploaderBackground: BLACK_2,
    uploaderBackgroundActive: BLACK_4,
    uploaderText: GREY_3,
};

export const NewDarkTheme = {
    ...NewTheme,
    linkText: BLUE_1,
    linkTextVisited: LIGHT_PURPLE,
    backgroundColor: BLACK_2,
    mainFontColor: GREY_2,
};
