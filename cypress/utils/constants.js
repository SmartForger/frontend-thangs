export const USER = {
  ID: 232,
  EMAIL: 'test@test.com',
  INVALID_EMAIL: 'test.test@test.com',
  PASSWORD: 'test',
  INVALID_PASSWORD: 'badPassword',
  NAME: 'Test',
}

export const USER2 = {
  ID: 246,
  EMAIL: 'test2@test2.com',
  INVALID_EMAIL: 'test.test@test.com',
  PASSWORD: 'test',
  INVALID_PASSWORD: 'badPassword',
  NAME: 'test2',
}

export const FOLDER = {
  NAME: 'TestFolder',
}

export const PATH = {
  LANDING: '/',
  SEARCH: '/search/',
  MY_THANGS: '/mythangs',
  PROFILE: `/${USER.NAME}`,
  MY_THANGS_ALL_FILES: '/mythangs/all-files',
}

export const MODEL = {
  FILENAME: 'horn1.stl',
  TITLE: 'Test Name',
  DESCRIPTION: 'Test Description',
  COMMENT: 'Test comment',
}

export const MODEL_TEST_TITLE = `[title="${MODEL.TITLE}"]`

export const SEARCH = {
  VALID_QUERY: 'bacon',
}

export const BODY = 'body'

export const CLASSES = {
  LOGIN_FORM: '[class^=Signin]',
  LOGIN_BUTTON: '[class^=Signin_Button]',
  SIGNUP_BUTTON: '[class^=Signup_Button]',
  SIGNUP_LOGIN_ERROR: '[class^=Signup_ErrorText]',
  CLOSE_LOGIN_FORM: '[class^=Signin_ExitButton]',
  CLOSE_SIGNUP_FORM: '[class^=Signup_ExitButton]',
  SIGNUP_LINK_ON_LOGIN: '[class^=Signin_HasAccountButton]',
  LOGIN_LINK_ON_SIGNUP: '[class^=Signup_HasAccountButton]',
  USER_NAVBAR: '[class^=ProfileDropdown_ClickableButton]',
  NOTIFICATIONS_BUTTON: '[class^=NotificationsButton_NotificationIconWrapper]',
  NOTIFICATIONS_DROPDOWN: '[class^="NotificationsButton"] + [class*="DropdownMenu"]',
  NOTIFICATIONS_TEXT: '[class^=NotificationSnippet_text]',
  PROFILE_BUTTON: '[class^=ProfileDropdown_ClickableButton]',
  PROFILE_DROPDOWN:
    '[class^="ProfileDropdown_ClickableButton"] + [class*="DropdownMenu"]',
  SEARCH_BAR_BUTTON: '[class^=SearchBar_SearchButton]',
  HEADER_DESKTOP: '[class^="Header_DesktopOnly"]',
  LANDING_SEARCH_BAR_UPLOAD: '[class^=LandingSearchBar_Upload]',
  LANDING_FILTER_BUTTON: '[class^=FilterDropdown_ClickableButton]',
  LANDING_FILTER_DROPDOWN: '[class^=DropdownMenu]',
  LANDING_TITLE: '[class^=Title]',
  UPLOAD_FRAME: '[class^=UploadFrame]',
  UPLOAD_FORM: '[class^=Upload_Column__form]',
  UPLOAD_BUTTON_GROUP: '[class^=UploadForm_ButtonGroup]',
  UPLOAD_BUTTON: '[class^="Button"]',
  MODEL_CARD_EDIT_BUTTON: '[class^=EditModel_EditIcon]',
  MODEL_PAGE_TITLE: '[class^=ModelTitle_Text]',
  MODEL_PAGE_AUTHOR: '[class^=ModelTitle_ProfileAuthor]',
  MODEL_PAGE_DESCRIPTION: '[class^=Model_ModelDescription]',
  MODEL_PAGE_STATS: '[class^=Model_ModelStats]',
  MODEL_PAGE_LIKE_BUTTON: '[class^=Model_SocialButtons]',
  MODEL_PAGE_FOLLOW_BUTTON: '[class^=ToggleFollowButton]',
  MODEL_ADD_COMMENT_FORM: '[class^=NewModelCommentForm]',
  MODEL_COMMENT_FORM: '[class^=CommentsForModel_Comment]',
  MODEL_NEW_UPLOADED_COMMENT: '[class^=CommentsForModel_CommentBody]',
  MODEL_SIDEBAR_BUTTON: '[class^=Model_SidebarButton]',
  BUTTON: '[class^=Button]',
  MY_THANGS: '[class^=MyThangs]',
  SIGNUP_FORM: '[class^=Signup]',
  DELETE_MODEL_BUTTON: '[class^=DeleteForm_Button]',
  PROFILE_FOLLOW_BUTTON: '[class^=Profile_ProfileButton]',
  MY_THANGS_NAVBAR: '[class^=WorkspaceNavbar_NavContainer]',
  MY_THANGS_RECENT_FILES: '[class^=RecentFilesView_Content]',
  MY_THANGS_ADD_BUTTON: '[class^=WorkspaceNavbar_AddButton]',
  MY_THANGS_ADD_MENU: '[class^=AddMenu]',
  MY_THANGS_SHARED_FILES: '[class^=SharedFilesView_Content]',
  MY_THANGS_LIKED_MODELS: '[class^=LikedModels]',
  MY_THANGS_SAVED_SEARCHES: '[class^=SavedSearches]',
  MY_THANGS_EDIT_PROFILE: '[class^=EditProfile_Content]',
  HEADER_NOTIFICATIONS_UNREAD_BADGE: '[class^=NotificationsButton_UnreadBadge]',
  MY_THANGS_ADD_FOLDER: '[class^=AddFolder_Column]',
  MY_THANGS_INPUT: '[class^=Input]',
  MY_THANGS_FOLDER_FORM_BUTTONS: '[class^=FolderForm_ButtonContainer]',
  MY_THANGS_FOLDER_FORM_TOGGLE_BUTTON: '[class^=Toggle_Button]',
  MY_THANGS_FOLDER_VIEW_ROW: '[class^=FolderView_Row]',
  MY_THANGS_FOLDER_PRIVATE: '[class^=PadlockIcon_Header]',
  MY_THANGS_MENU_BUTTON: '[class^=MenuButton]',
  MY_THANGS_DELETE_FORM_BUTTON: '[class^=DeleteForm_Button]',
  MY_THANGS_NO_FILES: '[class^=NoFilesMessage]',
  MY_THANGS_ALL_FILES_ROW: '[class^=AllFilesView]',
}

export const MODEL_CARD = (title = MODEL.TITLE) => `[title="${title}"]`

export const DATA_CY = {
  LOGIN_FORM_ERROR: '[data-cy=form-error]',
  LOGIN_EMAIL_INPUT: '[data-cy=cy_email-input]',
  LOGIN_PASSWORD_INPUT: '[data-cy=cy_password-input]',
  SIGNUP_LINK_ON_LOGIN: '[data-cy=signup-link-on-login]',
  SIGNUP_FORM: '[data-cy=signup-form]',
  MULTIUPLOAD_FORM: '[data-cy=multi-upload-form]',
  USER_NAVBAR: '[data-cy=user-nav]',
  NOTIFICATIONS_BUTTON: '[data-cy=notifications-button]',
  NOTIFICATIONS_DROPDOWN: '[data-cy=notifications-dropdown]',
  UPLOAD_BUTTON: '[data-cy=upload-button]',
  UPLOAD_OVERLAY: '[data-cy=upload-overlay]',
  MULTI_UPLOAD_OVERLAY: '[data-cy=multi-upload-overlay]',
}

export const TEXT = {
  LOG_IN: 'Log in',
  SIGN_UP: 'Sign up',
  SIGN_OUT: 'Sign Out',
  LOGIN_ERROR: 'Invalid user ID or password.',
  SIGNUP_EMAIL_ERROR: 'Please enter a valid e-mail address',
  SIGNUP_CONFIRM_PASS_ERROR: 'Please ensure that both passwords match',
  DOWNLOADS: 'Downloads',
  POPULAR: 'Popular',
  NEW: 'New',
  TRENDING: 'Trending',
  DELETE_MODEL: 'Delete Model',
  CONFIRM: 'Confirm',
  LIKES: 'likes',
  CURRENT_YEAR: `${new Date().getFullYear()}`,
  LIKE: 'Like',
  LIKED: 'Liked',
  LIKED_LOWER_CASE: 'liked',
  FOLLOW: 'Follow',
  FOLLOWED: 'followed',
  UNFOLLOW: 'Unfollow',
  UPLOAD: 'Upload',
  COMMENT: 'Comment',
  UPLOAD_NEW_VERSION: 'Upload new version',
  NEW_VERSION_UPLOADED: 'New Version Uploaded',
  REMOVE: 'Remove',
  DELETE: 'Delete',
  DOWNLOAD_MODEL_BUTTON: 'Download Model',
  VIEW_MY_THANGS: 'View My Thangs',
  ADD_NEW: 'Add New',
  SHARED: 'Shared',
  LIKED_MODELS: 'Liked Models',
  SAVED_SEARCHES: 'Saved Searches',
  PROFILE_SETTINGS: 'Profile Settings',
  CREATE_FOLDER: 'Create Folder',
  FOLDER_NAME: 'Folder Name',
  SAVE: 'Save',
  COMMENTED: 'commented',
  DOWNLOADED: 'downloaded',
  UPLOADED_NEW_VERSION: 'uploaded new version',
}

export const PROPS = {
  VISIBLE: 'be.visible',
  INVISIBLE: 'not.be.visible',
  NOT_EMPTY: 'not.be.empty',
  CONTAIN: 'contain',
}
