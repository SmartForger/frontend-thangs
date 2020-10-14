import 'cypress-file-upload'
import {
  clickOnElement,
  clickOnTextInsideClass,
  deleteModel,
  editAndSaveFile,
  goTo,
  isElement,
  isTextInsideClass,
  login,
  openUpload,
  uploadFile,
} from '../../../utils/common-methods'
import { CLASSES, MODEL, MODEL_TEST_TITLE, PATH, PROPS, TEXT } from '../../constants'
import { commentInput, enterValidValue, uploadInput } from '../../../utils/inputs'

describe('The Model Page', () => {
  beforeEach(() => {
    login()
  })

  it('Upload model', () => {
    openUpload()
    uploadFile(MODEL.FILENAME, uploadInput)
    editAndSaveFile()
    cy.wait(3000)
    goTo(PATH.PROFILE)
    isElement(MODEL_TEST_TITLE, PROPS.VISIBLE)
  })

  it('Check model for name, author and description not empty', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    cy.wait(2000)
    isElement(CLASSES.MODEL_PAGE_TITLE, PROPS.NOT_EMPTY)
    isElement(CLASSES.MODEL_PAGE_AUTHOR, PROPS.NOT_EMPTY)
    isElement(CLASSES.MODEL_PAGE_DESCRIPTION, PROPS.NOT_EMPTY)
  })

  it('Check model comments', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    cy.wait(2000)
    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)
  })

  it('Check redirect to my thangs after upload of new version', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    cy.wait(2000)
    clickOnTextInsideClass(CLASSES.MODEL_SIDEBAR_BUTTON, TEXT.UPLOAD_NEW_VERSION)
    uploadFile(MODEL.FILENAME, uploadInput)
    editAndSaveFile()
    cy.wait(2000)
    isElement(CLASSES.MY_THANGS, PROPS.VISIBLE)
  })

  it('Check comment on previous version model page', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    cy.wait(2000)
    isTextInsideClass(
      CLASSES.MODEL_NEW_UPLOADED_COMMENT,
      TEXT.NEW_VERSION_UPLOADED,
      PROPS.VISIBLE
    )
  })

  it('Model has information: likes, downloads, date of upload', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    cy.wait(3000)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.LIKES)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.DOWNLOADS)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.CURRENT_YEAR)
    deleteModel()
  })

  it('Check for like/unlike button', () => {
    goTo(PATH.EXTERNAL_MODEL)
    cy.wait(2000)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_PAGE_LIKE_BUTTON)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_PAGE_LIKE_BUTTON)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.INVISIBLE)
  })

  it('Check for follow/unfollow button', () => {
    goTo(PATH.EXTERNAL_MODEL)
    cy.wait(2000)
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_PAGE_FOLLOW_BUTTON)
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_PAGE_FOLLOW_BUTTON)
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.INVISIBLE)
  })

  it('Delete model', () => {
    deleteModel()
  })
})
