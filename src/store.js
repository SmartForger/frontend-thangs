import { storeonDevtools } from 'storeon/devtools'
import { createStoreon } from 'storeon'
import arDownloadStore from '@store/arDownload/store'
import attachmentFileStore from '@store/uploadAttachmentFiles/store'
import commentsStore from '@store/comments/store'
import compareStore from '@store/compare/store'
import experimentsStore from '@store/experiments/store'
import folderNavStore from '@store/folderNav/store'
import folderLikesStore from '@store/folderLikes/store'
import folderStore from '@store/folders/store'
import modelAttachments from '@store/modelAttachments/store'
import modelDownloadUrl from '@store/modelDownloadUrl/store'
import modelFileStore from '@store/uploadModelFiles/store'
import modelHistory from '@store/modelHistory/store'
import modelPreviewsStore from '@store/modelPreviews/store'
import modelsStatsStore from '@store/modelsStats/store'
import modelsStore from '@store/models/store'
import notificationsStore from '@store/notifications/store'
import relatedModelsStore from '@store/relatedModels/store'
import geoSearchStore from '@store/geoSearch/store'
import textSearchStore from '@store/textSearch/store'
import searchMyThangsStore from '@store/searchMyThangs/store'
import searchSubscriptionsStore from '@store/searchSubscriptions/store'
import thangsStore from '@store/thangs/store'
import userAvatarStore from '@store/userAvatar/store'
import userLikedModelsStore from '@store/userLikedModels/store'
import userOwnModelsStore from '@store/userOwnModels/store'
import usersIdsStore from '@store/usersIds/store'
import usersStore from '@store/users/store'
import licenseStore from '@store/license/store'
import licenseDownloadUrl from '@store/licenseDownloadUrl/store'

const storeParts = [
  arDownloadStore,
  attachmentFileStore,
  commentsStore,
  compareStore,
  experimentsStore,
  folderNavStore,
  folderLikesStore,
  folderStore,
  modelAttachments,
  modelDownloadUrl,
  modelFileStore,
  modelHistory,
  modelPreviewsStore,
  modelsStatsStore,
  modelsStore,
  notificationsStore,
  relatedModelsStore,
  geoSearchStore,
  textSearchStore,
  searchMyThangsStore,
  searchSubscriptionsStore,
  thangsStore,
  userAvatarStore,
  userLikedModelsStore,
  userOwnModelsStore,
  usersIdsStore,
  usersStore,
  licenseStore,
  licenseDownloadUrl,
]

const store = createStoreon([
  ...storeParts,
  process.env.NODE_ENV === 'development' && storeonDevtools,
])

export default store
