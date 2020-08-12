import { storeonDevtools } from 'storeon/devtools'
import { createStoreon } from 'storeon'
import teamsStore from '@store/teams/store'
import folderStore from '@store/folders/store'
import modelsStore from '@store/models/store'
import modelPreviewsStore from '@store/modelPreviews/store'
import commentsStore from '@store/comments/store'
import userStore from '@store/user/store'
import uploadModelStore from '@store/uploadModel/store'

const storeParts = [
  commentsStore,
  folderStore,
  modelPreviewsStore,
  modelsStore,
  teamsStore,
  uploadModelStore,
  userStore,
]

const store = createStoreon([
  ...storeParts,
  process.env.NODE_ENV === 'development' && storeonDevtools,
])

export default store
