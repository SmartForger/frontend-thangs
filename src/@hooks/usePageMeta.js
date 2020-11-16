import * as metaData from '@constants/metaData'

const usePageMeta = page => {
  switch (page) {
    case 'search':
      return {
        title: metaData.searchTitle,
        description: metaData.searchDescription,
      }
    case 'model':
      return {
        title: metaData.modelTitle,
        description: metaData.modelDescription,
      }
    case 'profile':
      return {
        title: metaData.profileTitle,
        description: metaData.profileDescription,
      }
    case 'aboutUs':
      return {
        title: metaData.aboutUsTitle,
        description: metaData.aboutUsDescription,
      }
    case 'home':
      return {
        title: metaData.homeTitle,
        description: metaData.homeDescription,
      }
    case 'likes':
      return {
        title: metaData.likesTitle,
        description: metaData.likesDescription,
      }
    case 'date':
      return {
        title: metaData.dateTitle,
        description: metaData.dateDescription,
      }
    case 'downloaded':
      return {
        title: metaData.downloadedTitle,
        description: metaData.downloadedDescription,
      }
    case 'trending':
      return {
        title: metaData.trendingTitle,
        description: metaData.trendingDescription,
      }
    case 'showSignin':
      return {
        title: metaData.showSigninTitle,
        description: metaData.showSigninDescription,
      }
    case 'showSignup':
      return {
        title: metaData.showSignupTitle,
        description: metaData.showSignupDescription,
      }
    default:
      return {
        title: metaData.thangsTitle,
        description: metaData.thangsDescription,
      }
  }
}

export default usePageMeta
