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
} from '../../../utils/common-methods'
import {
  CLASSES,
  MODEL,
  PROPS,
  TEXT,
  USER,
  USER2,
} from '../../../utils/constants'
import { commentInput, enterValidValue, uploadInput } from '../../../utils/inputs'
import { multiUpload, deleteModel } from '../../../utils/uploadMethods'

describe('User notifications', () => {

  it('User2 follows User1', () => {
    loginByUser({
      email: USER2.EMAIL,
      password: USER2.PASSWORD,
    })
    goTo(`/${USER.NAME}`)

    //follow
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    clickOnElement(CLASSES.USER_FOLLOW_BUTTON)
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
    clickOnElement(CLASSES.MODEL_PAGE_LIKE_BUTTON)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)

    //comment
    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)

    //version
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.UPLOAD_NEW_VERSION)
    uploadFile(MODEL.FILENAME, uploadInput)
    editAndSaveFile()
    urlShouldIncludeAfterTimeout('mythangs/all-files', 10000)
    isElementContains('[class *="FileTable_FileName"]', MODEL.TITLE)

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

    //check for at least 5 new notifications in badge
    cy.get(CLASSES.HEADER_NOTIFICATIONS_UNREAD_BADGE)
      .invoke('text')
      .then(parseFloat)
      .should('be.gt', 5)

    openNotifications()
    cy.get('[class^=NotificationSnippet_text]', { timeout: 5000 })
      .should('contain', USER2.NAME)
      .and('contain', 'commented')

    cy.get('[class^=NotificationSnippet_text]', { timeout: 5000 })
      .should('contain', USER2.NAME)
      .and('contain', 'downloaded')

    cy.get('[class^=NotificationSnippet_text]', { timeout: 5000 })
      .should('contain', USER2.NAME)
      .and('contain', 'uploaded new version')

    cy.get('[class^=NotificationSnippet_text]', { timeout: 5000 })
      .should('contain', USER2.NAME)
      .and('contain', 'liked')

    cy.get('[class^=NotificationSnippet_text]', { timeout: 5000 })
      .should('contain', USER2.NAME)
      .and('contain', 'followed')

    cy.get('[class^=NotificationSnippet_text]', { timeout: 5000 })
      .should('contain', USER2.NAME)
      .and('contain', 'uploaded')
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
    deleteModel(MODEL.TITLE)
  })

  it('Cleanup User1', () => {
    loginByUser({
      email: USER.EMAIL,
      password: USER.PASSWORD,
    })
    deleteModel(MODEL.TITLE)
  })
  
})
