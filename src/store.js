import { storeonDevtools } from 'storeon/devtools'
import { createStoreon } from 'storeon'
import actionBarStore from '@store/actionBar/store'
import commentsStore from '@store/comments/store'
import fileStore from '@store/uploadFiles/store'
import folderNavStore from '@store/folderNav/store'
import folderLikesStore from '@store/folderLikes/store'
import folderStore from '@store/folders/store'
import modelDownloadUrl from '@store/modelDownloadUrl/store'
import modelPreviewsStore from '@store/modelPreviews/store'
import modelsStatsStore from '@store/modelsStats/store'
import modelsStore from '@store/models/store'
import notificationsStore from '@store/notifications/store'
import overlayStore from '@store/overlay/store'
import relatedModelsStore from '@store/relatedModels/store'
import searchStore from '@store/search/store'
import searchMyThangsStore from '@store/searchMyThangs/store'
import searchSubscriptionsStore from '@store/searchSubscriptions/store'
import teamsStore from '@store/teams/store'
import thangsStore from '@store/thangs/store'
import uploadModelStore from '@store/uploadModel/store'
import userAvatarStore from '@store/userAvatar/store'
import userLikedModelsStore from '@store/userLikedModels/store'
import userOwnModelsStore from '@store/userOwnModels/store'
import usersIdsStore from '@store/usersIds/store'
import usersStore from '@store/users/store'

const storeParts = [
  actionBarStore,
  commentsStore,
  fileStore,
  folderNavStore,
  folderLikesStore,
  folderStore,
  modelDownloadUrl,
  modelPreviewsStore,
  modelsStatsStore,
  modelsStore,
  notificationsStore,
  overlayStore,
  relatedModelsStore,
  searchStore,
  searchMyThangsStore,
  searchSubscriptionsStore,
  teamsStore,
  thangsStore,
  uploadModelStore,
  userAvatarStore,
  userLikedModelsStore,
  userOwnModelsStore,
  usersIdsStore,
  usersStore,
]

const store = createStoreon([
  ...storeParts,
  process.env.NODE_ENV === 'development' && storeonDevtools,
])

export default store
