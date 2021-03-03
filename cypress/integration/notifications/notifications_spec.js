import {
  clickOnTextInsideClass,
  goTo,
  isTextInsideClass,
  loginByUser,
  openNotifications,
  isElement,
  isElementContainTwoValues,
  clearModelsAndFolders,
  log,
} from '../../utils/common-methods'
import { CLASSES, MODEL, PROPS, TEXT } from '../../utils/constants'
import { commentInput, enterValidValue } from '../../utils/inputs'
import { multiUpload } from '../../utils/uploadMethods'

let activeUser
let sideUser
describe('User notifications', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
    cy.getCookie('sideUser').then(({ value }) => {
      sideUser = JSON.parse(value)
    })
  })

  it('User2 follows User1', () => {
    loginByUser({
      email: sideUser.EMAIL,
      password: sideUser.PASSWORD,
    })
    goTo(`/${activeUser.NAME}`)

    //follow
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON, { timeout: 2000 }).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
  })

  it('User1 uploads model', () => {
    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })
    multiUpload()
  })

  it('User2 likes, comments, version, downloads User1 model', () => {
    loginByUser({
      email: sideUser.EMAIL,
      password: sideUser.PASSWORD,
    })
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)

    log('likes')
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    clickOnTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)

    log('comment')
    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)

    /*
    // TODO: Revert it back after cypress fix the issue with download.
    log('download')
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.DOWNLOAD_MODEL_BUTTON)
    isTextInsideClass(
      CLASSES.MODEL_SIDEBAR_BUTTON,
      TEXT.DOWNLOAD_MODEL_BUTTON,
      PROPS.INVISIBLE
    )
    isTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, 'Downloading', PROPS.VISIBLE)
    isTextInsideClass(
      CLASSES.MODEL_SIDEBAR_BUTTON,
      TEXT.DOWNLOAD_MODEL_BUTTON,
      PROPS.VISIBLE
    )

      // TODO: Actualize version upload, need to be merged
      //version
      clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.UPLOAD_NEW_VERSION)
      uploadFile(MODEL.FILENAME, uploadInput)
      editAndSaveFile()
      urlShouldIncludeAfterTimeout(PATH.MY_THANGS_ALL_FILES, 10000)
      isElementContains(CLASSES.MY_THANGS_ALL_FILES_ROW, MODEL.TITLE)
      */
  })

  it('User1 check notifications', () => {
    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })

    log('unread badge')
    isElement(CLASSES.HEADER_NOTIFICATIONS_UNREAD_BADGE, PROPS.VISIBLE)

    openNotifications()

    log('is commented')
    isElementContainTwoValues(CLASSES.NOTIFICATIONS_TEXT, sideUser.NAME, TEXT.COMMENTED)

    /*
    // TODO: Revert it back after cypress fix the issue with download.
    log('is downloaded')
    isElementContainTwoValues(CLASSES.NOTIFICATIONS_TEXT, sideUser.NAME, TEXT.DOWNLOADED)

      // TODO: Actualize version upload, need to be merged
      log('is new version uploaded')
      isElementContainTwoValues(
        CLASSES.NOTIFICATIONS_TEXT,
        SUPPORT_USER2.NAME,
        TEXT.UPLOADED_NEW_VERSION
      )
      */

    log('is liked')
    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      sideUser.NAME,
      TEXT.LIKED_LOWER_CASE
    )

    log('is followed')
    isElementContainTwoValues(CLASSES.NOTIFICATIONS_TEXT, sideUser.NAME, TEXT.FOLLOWED)
  })

  it('User1 delete his notifications', () => {
    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })
    clearModelsAndFolders(activeUser)
  })

  it('User2 delete his notifications', () => {
    loginByUser({
      email: sideUser.EMAIL,
      password: sideUser.PASSWORD,
    })
    clearModelsAndFolders(sideUser)
  })
})
