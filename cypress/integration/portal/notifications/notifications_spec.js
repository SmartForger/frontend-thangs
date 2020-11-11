import {
  clickOnElement,
  clickOnTextInsideClass,
  editAndSaveFile,
  goTo,
  isTextInsideClass,
  uploadFile,
  isElementContains,
  loginByUser,
  urlShouldIncludeAfterTimeout,
  openNotifications,
  clickOnElementByText,
  deleteSingleFile,
  isElement,
  isElementContainTwoValues,
} from '../../../utils/common-methods'
import { CLASSES, MODEL, PATH, PROPS, TEXT, USER, USER2 } from '../../../utils/constants'
import { commentInput, enterValidValue, uploadInput } from '../../../utils/inputs'
import { multiUpload } from '../../../utils/uploadMethods'

describe('User notifications', () => {
  it('User2 follows User1', () => {
    loginByUser({
      email: USER2.EMAIL,
      password: USER2.PASSWORD,
    })
    goTo(`/${USER.NAME}`)

    //follow
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.USER_FOLLOW_BUTTON, { timeout: 60000 }).click()
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
  })

  it('User1 uploads model', () => {
    loginByUser({
      email: USER.EMAIL,
      password: USER.PASSWORD,
    })
    multiUpload()
  })

  it('User2 likes, comments, version, downloads User1 model', () => {
    loginByUser({
      email: USER2.EMAIL,
      password: USER2.PASSWORD,
    })
    goTo(`/${USER.NAME}`)

    clickOnElement(`[title="${MODEL.TITLE}"]`)

    //like
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    clickOnElementByText(TEXT.LIKE)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)

    //comment
    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)

    //version
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.UPLOAD_NEW_VERSION)
    uploadFile(MODEL.FILENAME, uploadInput)
    editAndSaveFile()
    urlShouldIncludeAfterTimeout(PATH.MY_THANGS_ALL_FILES, 10000)
    isElementContains(CLASSES.MY_THANGS_ALL_FILES_ROW, MODEL.TITLE)

    //download
    goTo(`/${USER.NAME}`)
    clickOnElement(`[title="${MODEL.TITLE}"]`)
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.DOWNLOAD_MODEL_BUTTON)
  })

  it('User1 check notifications badge count', () => {
    loginByUser({
      email: USER.EMAIL,
      password: USER.PASSWORD,
    })

    isElement(CLASSES.HEADER_NOTIFICATIONS_UNREAD_BADGE, PROPS.VISIBLE)

    openNotifications()
    isElementContainTwoValues(CLASSES.NOTIFICATIONS_TEXT, USER2.NAME, TEXT.COMMENTED)
    isElementContainTwoValues(CLASSES.NOTIFICATIONS_TEXT, USER2.NAME, TEXT.DOWNLOADED)
    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      USER2.NAME,
      TEXT.UPLOADED_NEW_VERSION
    )
    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      USER2.NAME,
      TEXT.UPLOADED_NEW_VERSION
    )

    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      USER2.NAME,
      TEXT.LIKED_LOWER_CASE
    )

    isElementContainTwoValues(CLASSES.NOTIFICATIONS_TEXT, USER2.NAME, TEXT.FOLLOWED)
  })

  it('Cleanup User2', () => {
    loginByUser({
      email: USER2.EMAIL,
      password: USER2.PASSWORD,
    })
    goTo(`/${USER.NAME}`)
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    clickOnElement(CLASSES.USER_FOLLOW_BUTTON)
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    deleteSingleFile()
  })

  it('Cleanup User1', () => {
    loginByUser({
      email: USER.EMAIL,
      password: USER.PASSWORD,
    })
    deleteSingleFile()
  })
})
