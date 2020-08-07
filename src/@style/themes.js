import { colors } from './colors.js'

const fontMedium = '"Montserrat", sans-serif'
const fontMain = '"Montserrat", sans-serif'
const boxShadow = '0px 5px 10px 0px rgba(35, 37, 48, 0.25)'
const headerFont = 'Lexend Deca'

const maxWidth = '1440px'
export const NewTheme = {
  variables: {
    colors: {
      activityCount: colors.purple[300],
      avatarInitialsColor: colors.purple[300],
      avatarTextColor: colors.purple[200],
      backgroundColor: colors.white[900],
      brandColor: colors.gold[500],
      cardBackground: colors.white[400],
      cardHeartColor: colors.blue[500],
      deleteButton: colors.purple[500],
      dropdownTextColor: colors.white[800],
      dropdownBackgroundColor: colors.purple[500],
      errorTextColor: colors.error,
      errorTextBackground: colors.errorBackground,
      emptyImageBackground: colors.purple[500],
      flashColor: colors.purple[400],
      flashColorText: colors.white[900],
      formLabelColor: colors.grey[300],
      imagePlaceholderText: colors.purple[300],
      invertedHeaderBackground: colors.purple[900],
      headerColor: colors.grey[900],
      headerColorOnDarkBackground: colors.white[400],
      linkText: colors.blue[500],
      linkTextVisited: colors.blue[700],
      logoText: colors.purple[700],
      mainFontColor: colors.grey[700],
      matchingSubheaderColor: colors.grey[700],
      modelActionButtonBackground: colors.purple[300],
      modelActionButtonText: colors.white[400],
      modelDetailLabel: colors.purple[400],
      modelOwnerLink: colors.blue[500],
      modelPrimaryButtonBackground: colors.blue[500],
      modelPrimaryButtonText: colors.white[900],
      modelTitleText: colors.grey[700],
      modelViewerPlaceholder: colors.white[800],
      primaryButton: colors.blue[500],
      primaryButtonText: colors.white[900],
      primaryButtonDisabledColor: colors.purple[300],
      profileContentColor: colors.grey[700],
      profileNameColor: colors.grey[700],
      promotionalSecondaryTextColor: colors.purple[300],
      promotionalTextColor: colors.white[400],
      searchBackground: colors.white[400],
      searchIconColor: colors.purple[400],
      searchText: colors.grey[300],
      secondaryButton: colors.purple[300],
      secondaryButtonText: colors.white[400],
      selectedProfileTabColor: colors.grey[700],
      textColorOnDarkBackground: colors.grey[300],
      textOnBrandColor: colors.gold[800],
      textInputBackground: colors.white[800],
      textInputColor: colors.grey[700],
      textInputPlaceholderColor: colors.grey[300],
      unselectedProfileTabColor: colors.purple[400],
      uploaderBackground: colors.purple[900],
      uploaderBackgroundActive: colors.purple[700],
      uploaderText: colors.purple[300],
      viewerText: colors.grey[500],
      viewerTitle: colors.grey[700],
      viewerExitColor: colors.grey[900],
      viewerControlBorderColor: colors.purple[200],
      viewerControlText: colors.grey[300],
      zeroStateColor: colors.grey[500],
      zeroStateBackground: colors.purple[200],
    },
    fonts: {
      buttonFont: fontMedium,
      headerFont,
      mainFont: fontMain,
    },
    maxWidth,
    boxShadow,
  },
}

export const NewDarkTheme = {
  ...NewTheme,
  variables: {
    ...NewTheme.variables,
    colors: {
      ...NewTheme.variables.colors,
      backgroundColor: colors.purple[900],
      linkText: colors.blue[300],
      mainFontColor: colors.grey[300],
      textInputBackground: colors.white[900],
    },
  },
}
