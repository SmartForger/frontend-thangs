import {
  clickOnTextInsideClass,
  editAndSaveFile,
  goTo,
  isTextInsideClass,
  uploadFile,
  isElementContains,
  loginByUser,
  urlShouldIncludeAfterTimeout,
  openNotifications,
  isElement,
  isElementContainTwoValues,
  unfollowUser,
  clearModelsAndFolders,
  log,
} from '../../utils/common-methods'
import {
  CLASSES,
  MODEL,
  PATH,
  PROPS,
  TEXT,
  USER3,
  USER4,
  MODEL_CARD,
} from '../../utils/constants'
import { commentInput, enterValidValue, uploadInput } from '../../utils/inputs'
import { multiUpload } from '../../utils/uploadMethods'

const ACTION_USER1 = USER3
const SUPPORT_USER2 = USER4

describe('User notifications', () => {
  before(() => {
    unfollowUser(SUPPORT_USER2, ACTION_USER1)
    clearModelsAndFolders(ACTION_USER1)
    clearModelsAndFolders(SUPPORT_USER2)
  })

  it('User2 follows User1', () => {
    loginByUser({
      email: SUPPORT_USER2.EMAIL,
      password: SUPPORT_USER2.PASSWORD,
    })
    goTo(`/${ACTION_USER1.NAME}`)

    //follow
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON, { timeout: 2000 }).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
  })

  it('User1 uploads model', () => {
    loginByUser({
      email: ACTION_USER1.EMAIL,
      password: ACTION_USER1.PASSWORD,
    })
    multiUpload()
  })

  it('User2 likes, comments, version, downloads User1 model', () => {
    loginByUser({
      email: SUPPORT_USER2.EMAIL,
      password: SUPPORT_USER2.PASSWORD,
    })
    goTo(`/${ACTION_USER1.NAME}`)

    cy.get(`[title="${MODEL.TITLE}"] [class^=ModelCard_Thumbnail]`, {
      timeout: 20000,
    }).click()

    log('likes')
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    clickOnTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)

    log('comment')
    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)
    /*
    // TODO: Actualize version upload, need to be merged
    //version
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.UPLOAD_NEW_VERSION)
    uploadFile(MODEL.FILENAME, uploadInput)
    editAndSaveFile()
    urlShouldIncludeAfterTimeout(PATH.MY_THANGS_ALL_FILES, 10000)
    isElementContains(CLASSES.MY_THANGS_ALL_FILES_ROW, MODEL.TITLE)
    */

    log('download')
    goTo(`/${ACTION_USER1.NAME}`)
    cy.get(MODEL_CARD(), { timeout: 2000 }).click()
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.DOWNLOAD_MODEL_BUTTON)
  })

  it('User1 check notifications', () => {
    loginByUser({
      email: ACTION_USER1.EMAIL,
      password: ACTION_USER1.PASSWORD,
    })

    log('unread badge')
    isElement(CLASSES.HEADER_NOTIFICATIONS_UNREAD_BADGE, PROPS.VISIBLE)

    openNotifications()

    log('is commented')
    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      SUPPORT_USER2.NAME,
      TEXT.COMMENTED
    )

    log('is downloaded')
    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      SUPPORT_USER2.NAME,
      TEXT.DOWNLOADED
    )

    /*
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
      SUPPORT_USER2.NAME,
      TEXT.LIKED_LOWER_CASE
    )

    log('is followed')
    isElementContainTwoValues(
      CLASSES.NOTIFICATIONS_TEXT,
      SUPPORT_USER2.NAME,
      TEXT.FOLLOWED
    )
  })
})
