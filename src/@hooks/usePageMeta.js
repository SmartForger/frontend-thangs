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
    default:
      return {
        title: metaData.thangsTitle,
        description: metaData.thangsDescription,
      }
  }
}

export default usePageMeta
