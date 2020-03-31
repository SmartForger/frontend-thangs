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
// const GREY_1 = '#dbdbdf';
// const GREY_2 = '#d9d9d9';
// const GREY_3 = '#b9b9be';
const GREY_4 = '#989898';
const GREY_5 = '#88888b';
// const GREY_6 = '#7a7a7a';
const GREY_7 = '#616168';
// const BLACK_1 = '#515151';
// const BLACK_2 = '#232530';
// const BLACK_3 = '#231f20';
const BLACK_4 = '#464655';
const YELLOW_1 = '#ffbc00';
// const YELLOW_2 = '#cd9602';
// const YELLOW_3 = '#b18002';
// const BLUE_1 = '#1cb2f5';
const BLUE_2 = '#1b8cf8';
// const BLUE_3 = '#014d7c';
// const BLUE_4 = '#013047';
const BROWN = '#8b6400';
const WHITE_1 = '#efecec';

export const NewTheme = {
    logoText: BLACK_4,
    linkText: BLUE_2,
    brandColor: YELLOW_1,
    searchIcon: GREY_5,
    deleteButton: GREY_7,
    primaryButton: BLUE_2,
    primaryButtonText: WHITE_1,
    searchText: GREY_4,
    textOnBrandColor: BROWN,
    emptyImageBackground: GREY_7,
};

/** Styled for normal Pages
 *
  width: ${props => props.theme.pageWidth};
  height: ${props => props.theme.pageHeight};
  top: ${props => props.theme.pageTop};
  left: ${props => props.theme.pageLeft};
  margin-left: ${props => props.theme.pageMarginLeft};
 */
