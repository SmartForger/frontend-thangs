export const STORE_INIT = '@init'
/* Model Store Events */
export const INIT_MODEL = 'init-model'
export const UPDATE_MODEL_LIKES = 'update-model-likes'
export const FETCH_MODEL = 'fetch-model'
export const CHANGE_MODEL_STATUS = 'change-model-status'
export const UPDATE_MODEL = 'update-model'
export const DELETE_MODEL = 'delete-model'
/* Related Model Events */
export const FETCH_RELATED_MODELS = 'fetch-related-models'
/* Model Comments Store Events */
export const INIT_MODEL_COMMENTS = 'init-model-comments'
export const CHANGE_MODEL_COMMENTS = 'change-comment-status'
export const NEW_MODEL_COMMENTS = 'new-model-comments'
export const FETCH_MODEL_COMMENTS = 'fetch-model-comments'
/* Model Likes Store Events */
export const LIKE_MODEL = 'like-model'
export const UNLIKE_MODEL = 'unlike-model'
export const CHANGE_LIKE_MODEL_STATUS = 'change-like-model-status'
/* Model Previews Store Events */
export const FETCH_MODEL_PREVIEW = 'fetch-model-previews'
export const LOADING_MODEL_PREVIEW = 'loading-model-previews'
export const LOADED_MODEL_PREVIEW = 'loaded-model-previews'
/* Model Download URL Store Events */
export const FETCH_MODEL_DOWNLOAD_URL = 'fetch-model-download-url'
export const LOADING_MODEL_DOWNLOAD_URL = 'loading-model-download-url'
export const LOADED_MODEL_DOWNLOAD_URL = 'loaded-model-download-url'
export const FAILED_MODEL_DOWNLOAD_URL = 'failed-model-download-url'
/* Folder Store Events */
export const UPDATE_FOLDERS = 'update-folders'
export const UPDATE_FOLDER = 'update-folder'
export const LOADING_FOLDER = 'loading-folders'
export const LOADED_FOLDER = 'loaded-folders'
export const ERROR_FOLDER = 'error-folders'
export const FETCH_FOLDERS = 'fetch-folders'
export const FETCH_FOLDER = 'fetch-folder'
export const SAVING_FOLDER = 'saving-folder'
export const SAVED_FOLDER = 'saved-folder'
export const ERROR_SAVING_FOLDER = 'error-saving-folder'
export const SAVED_FOLDER_DATA = 'saved-folder-data'
export const CREATE_FOLDER = 'create-folder'
export const DELETE_FOLDER = 'delete-folder'
export const INVITE_TO_FOLDER = 'invite-to-folder'
export const REVOKE_FOLDER_ACCESS = 'revoke-folder-access'
export const FOLDER_OPEN = 'folder_open'
export const FOLDER_CLOSE = 'folder_close'
export const LIKE_FOLDER = 'like_folder'
export const UNLIKE_FOLDER = 'unlike_folder'
export const CHANGE_LIKE_FOLDER_STATUS = 'change_like_folder_status'
export const EDIT_FOLDER = 'edit_folder'
/* Team Store Events */
export const ADD_TEAM = 'add-team'
export const FETCH_TEAM = 'fetch-team'
export const FETCH_TEAMS = 'fetch-teams'
export const SAVING_TEAM = 'saving-team'
export const SAVED_TEAM = 'saved-team'
export const ERROR_SAVING_TEAM = 'error-saving-team'
export const UPDATE_TEAM = 'update-team'
export const UPDATE_TEAMS = 'update-teams'
/* Overlay Store Events */
export const OPEN_OVERLAY = 'open-overlay'
export const CLOSE_OVERLAY = 'close-overlay'
export const SET_OVERLAY_DATA = 'set-overlay-data'
/* Notification Store Events */
export const FETCH_NOTIFICATIONS = 'fetch-notifications'
export const READ_NOTIFICATIONS = 'read-notifications'
export const CLEAR_NOTIFICATION = 'clear-notification'
export const CLEAR_NOTIFICATIONS = 'clear-notifications'
export const CHANGE_NOTIFICATION_STATUS = 'change-notification-status'
/* Search Result Store Events */
export const RESET_SEARCH_RESULTS = 'reset-search-results'
export const GET_MODEL_SEARCH_RESULTS = 'get-model-search-results'
export const GET_TEXT_SEARCH_RESULTS = 'get-text-search-results'
export const GET_RELATED_MODELS_VIA_THANGS = 'get-related-models-via-thangs'
export const GET_RELATED_MODELS_VIA_PHYNDEXER = 'get-related-models-via-phyndexer'
export const GET_RELATED_MODELS = 'get-related-models'
export const CHANGE_SEARCH_RESULTS_STATUS = 'change-search-results-status'
export const ERROR_POLLING_PHYNDEXER = 'error-polling-phyndexer'
/* Search Subscription Events */
export const SAVE_SUBSCRIPTION = 'save-subscription'
export const FETCH_SUBSCRIPTIONS = 'get-subscriptions'
export const READ_SUBSCRIPTION = 'read-subscription'
export const ENABLE_SUBSCRIPTION = 'enable-subscription'
export const DISABLE_SUBSCRIPTION = 'disable-subscription'
export const DELETE_SUBSCRIPTION = 'delete-subscription'
export const CHANGE_SEARCH_SUBSCRIPTION_STATUS = 'change-search-subscription-status'
/* Upload Model Store Events */
export const UPLOAD_MODEL_PHASE1 = 'upload-model-phase1'
export const UPLOAD_MODEL_PHASE2 = 'upload-model-phase2'
export const RESET_UPLOAD_MODEL = 'reset-upload-model'
export const CHANGE_UPLOAD_MODEL_STATUS = 'change-upload-model-status'
/* upload Files Store Events */
export const UPLOAD_FILE = 'upload-files'
export const CHANGE_UPLOAD_FILE = 'change-upload-files'
export const RESET_UPLOAD_FILES = 'reset-upload-files'
export const REMOVE_UPLOAD_FILES = 'remove-upload-files'
export const ADD_UPLOAD_FILE = 'add-upload-file'
export const INIT_UPLOAD_FILE = 'init-upload-file'
export const SUBMIT_FILE = 'submit-file'
export const SUBMIT_FILES = 'submit-files'
/* Users Store Events */
export const INIT_USER = 'init-user'
export const CHANGE_USER_STATUS = 'change-user-status'
export const FETCH_USER = 'fetch-user'
export const UPDATE_USER = 'update-user'
export const FETCH_CURRENT_USER = 'fetch-currentUser'
export const RESET_CURRENT_USER = 'reset-currentUser'
export const FOLLOW_USER = 'follow-user'
export const UNFOLLOW_USER = 'unfollow-user'
export const LOCAL_FOLLOW_USER = 'local-follow-user'
/* User Liked Models Store Events */
export const INIT_USER_LIKED_MODELS = 'init-user-liked-models'
export const CHANGE_USER_LIKED_MODELS_STATUS = 'change-user-liked-models-status'
export const FETCH_USER_LIKED_MODELS = 'fetch-user-liked-models'
/* User Own Models Store Events */
export const INIT_USER_OWN_MODELS = 'init-user-own-models'
export const CHANGE_USER_OWNED_MODELS_STATUS = 'change-user-owned-models-status'
export const FETCH_USER_OWN_MODELS = 'fetch-user-own-models'
export const DELETE_USER_OWN_MODEL = 'delete-user-own-model'
/* User Avatar Store Events */
export const INIT_USER_AVATAR = 'init-user-avatar'
export const LOADING_USER_AVATAR = 'loading-user-avatar'
export const LOADED_USER_AVATAR = 'loaded-user-avatar'
export const FAILED_USER_AVATAR = 'failed-user-avatar'
export const UPLOAD_USER_AVATAR = 'upload-user-avatar'
export const DELETE_USER_AVATAR = 'delete-user-avatar'
/* Users Ids by Name */
export const INIT_USER_ID = 'init-user-id'
export const FETCH_USER_ID = 'fetch-user-id'
export const CHANGE_USER_ID_STATUS = 'change-user-id-status'
/* Models Stats Store Events */
export const INIT_MODELS_STATS = 'init-models-stats'
export const FETCH_MODELS_STATS = 'fetch-models-stats'
export const LOADING_MODELS_STATS = 'loading-models-stats'
export const LOADED_MODELS_STATS = 'loaded-models-stats'
export const FAILED_MODELS_STATS = 'failed-models-stats'
/* My Thangs Store Events */
export const FETCH_THANGS = 'fetch-thangs'
export const UPDATE_THANGS = 'update-thangs'
export const ERROR_THANGS = 'error-thangs'
export const LOADING_THANGS = 'loading-thangs'
export const LOADED_THANGS = 'loaded-thangs'
export const SEARCH_MY_THANGS = 'search-my-thangs'
export const UPDATE_SEARCH_THANGS = 'update-search-thangs'
