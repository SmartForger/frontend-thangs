import { storeonDevtools } from 'storeon/devtools'
import { createStoreon } from 'storeon'
import commentsStore from '@store/comments/store'
import experimentsStore from '@store/experiments/store'
import fileStore from '@store/uploadFiles/store'
import folderNavStore from '@store/folderNav/store'
import folderLikesStore from '@store/folderLikes/store'
import folderStore from '@store/folders/store'
import modelDownloadUrl from '@store/modelDownloadUrl/store'
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
import teamsStore from '@store/teams/store'
import thangsStore from '@store/thangs/store'
import userAvatarStore from '@store/userAvatar/store'
import userLikedModelsStore from '@store/userLikedModels/store'
import userOwnModelsStore from '@store/userOwnModels/store'
import usersIdsStore from '@store/usersIds/store'
import usersStore from '@store/users/store'
import licenseStore from '@store/license/store'
import licenseDownloadUrl from '@store/licenseDownloadUrl/store'

const storeParts = [
  commentsStore,
  experimentsStore,
  fileStore,
  folderNavStore,
  folderLikesStore,
  folderStore,
  modelDownloadUrl,
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
  teamsStore,
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
