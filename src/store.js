import { storeonDevtools } from 'storeon/devtools'
import { createStoreon } from 'storeon'
import teamsStore from '@store/teams/store'
import folderStore from '@store/folders/store'
import overlayStore from '@store/overlay/store'
import modelsStore from '@store/models/store'
import modelPreviewsStore from '@store/modelPreviews/store'
import commentsStore from '@store/comments/store'
import usersStore from '@store/users/store'
import userOwnModelsStore from '@store/userOwnModels/store'
import userLikedModelsStore from '@store/userLikedModels/store'
import uploadModelStore from '@store/uploadModel/store'
import searchStore from '@store/search/store'
import notificationsStore from '@store/notifications/store'
import modelLikesStore from '@store/modelLikes/store'
import modelDownloadUrl from '@store/modelDownloadUrl/store'
import relatedModelsStore from '@store/relatedModels/store'
import userAvatarStore from '@store/userAvatar/store'
import usersIdsStore from '@store/usersIds/store'

const storeParts = [
  commentsStore,
  folderStore,
  overlayStore,
  modelPreviewsStore,
  modelsStore,
  teamsStore,
  uploadModelStore,
  usersStore,
  userOwnModelsStore,
  userLikedModelsStore,
  searchStore,
  notificationsStore,
  modelLikesStore,
  modelDownloadUrl,
  userAvatarStore,
  relatedModelsStore,
  usersIdsStore,
]

const store = createStoreon([
  ...storeParts,
  process.env.NODE_ENV === 'development' && storeonDevtools,
])

export default store
