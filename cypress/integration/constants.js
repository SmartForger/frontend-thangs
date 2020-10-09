export const USER = {
  EMAIL: 'test@test.com',
  INVALID_EMAIL: 'test.test@test.com',
  PASSWORD: 'test',
  INVALID_PASSWORD: 'badPassword',
  NAME: 'Test',
}

export const PATH = {
  LANDING: '/',
  SEARCH: '/search/',
  EXTERNAL_MODEL: 'model/507',
  PROFILE: `/${USER.NAME}`,
}

export const MODEL = {
  FILENAME: 'horn1.stl',
  TITLE: 'Test Name',
  DESCRIPTION: 'Test Description',
}

export const MODEL_TEST_TITLE = `[title="${MODEL.TITLE}"]`

export const SEARCH = {
  VALID_QUERY: 'bacon',
}

export const BODY = 'body'

export const CLASSES = {
  LOGIN_FORM: '[class^=Signin]',
  LOGIN_BUTTON: '[class^=Signin_Button]',
  LOGIN_ERROR: '[class^=Signup_ErrorText]',
  CLOSE_LOGIN_FORM: '[class^=Signin_ExitButton]',
  SIGNUP_LINK_ON_LOGIN: '[class^=Signin_HasAccountButton]',
  USER_NAVBAR: '[class^=ProfileDropdown_ClickableButton]',
  NOTIFICATIONS_BUTTON: '[class^=NotificationsButton_NotificationIconWrapper]',
  NOTIFICATIONS_DROPDOWN: '[class^="NotificationsButton"] + [class*="DropdownMenu"]',
  PROFILE_BUTTON: '[class^=ProfileDropdown_ClickableButton]',
  PROFILE_DROPDOWN:
    '[class^="ProfileDropdown_ClickableButton"] + [class*="DropdownMenu"]',
  SEARCH_BAR_BUTTON: '[class^=SearchBar_SearchButton]',
  HEADER_DESKTOP: '[class^="Header_DesktopOnly"]',
  LANDING_SEARCH_BAR_UPLOAD: '[class^=LandingSearchBar_Upload]',
  FILTER_TABS: '[class^=TabsWrapper]',
  UPLOAD_FRAME: '[class^=UploadFrame]',
  UPLOAD_FORM: '[class^=Upload_Column__form]',
  UPLOAD_BUTTON_GROUP: '[class^=UploadForm_ButtonGroup]',
  UPLOAD_BUTTON: '[class^="Button"]',
  MODEL_CARD: '[class^=ModelCard]',
  MODEL_CARD_EDIT_BUTTON: '[class^=EditModel_EditIcon]',
  MODEL_PAGE_TITLE: '[class^=ModelTitle_Text]',
  MODEL_PAGE_AUTHOR: '[class^=ModelTitle_ProfileAuthor]',
  MODEL_PAGE_DESCRIPTION: '[class^=Model_ModelDescription]',
  MODEL_PAGE_STATS: '[class^=Model_ModelStats]',
  MODEL_PAGE_LIKE_BUTTON: '[class^=LikeModelButton]',
  MODEL_PAGE_FOLLOW_BUTTON: '[class^=ToggleFollowButton]',
}

export const DATA_CY = {
  LOGIN_FORM_ERROR: '[data-cy=form-error]',
  LOGIN_EMAIL_INPUT: '[data-cy=cy_email-input]',
  LOGIN_PASSWORD_INPUT: '[data-cy=cy_password-input]',
  SIGNUP_LINK_ON_LOGIN: '[data-cy=signup-link-on-login]',
  SIGNUP_FORM: '[data-cy=signup-form]',
  USER_NAVBAR: '[data-cy=user-nav]',
  NOTIFICATIONS_BUTTON: '[data-cy=notifications-button]',
  NOTIFICATIONS_DROPDOWN: '[data-cy=notifications-dropdown]',
  UPLOAD_BUTTON: '[data-cy=upload-button]',
  UPLOAD_OVERLAY: '[data-cy=upload-overlay]',
}

export const TEXT = {
  LOG_IN: 'Log in',
  LOGIN_ERROR: 'Invalid user ID or password.',
  DOWNLOADS: 'Downloads',
  POPULAR: 'Popular',
  NEW: 'New',
  DELETE_MODEL: 'Delete Model',
  CONFIRM: 'Confirm',
  LIKES: 'likes',
  CURRENT_YEAR: '2020',
  LIKE: 'Like',
  LIKED: 'Liked',
  FOLLOW: 'Follow',
  UNFOLLOW: 'Unfollow',
}

export const PROPS = {
  VISIBLE: 'be.visible',
  INVISIBLE: 'not.be.visible',
  NOT_EMPTY: 'not.be.empty',
}
