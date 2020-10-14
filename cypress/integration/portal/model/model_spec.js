import 'cypress-file-upload'
import {
  clickOnElement,
  clickOnElementByText,
  clickOnTextInsideClass,
  goTo,
  isElement,
  isTextInsideClass,
  login,
  openUpload,
  uploadFile,
} from '../../../utils/common-methods'
import { CLASSES, MODEL, MODEL_TEST_TITLE, PATH, PROPS, TEXT } from '../../constants'
import {
  clearInput,
  enterValidValue,
  modelDescriptionInput,
  modelTitleInput,
  uploadInput,
} from '../../../utils/inputs'

describe('The Model Page', () => {
  beforeEach(() => {
    login()
  })

  it('Upload model', () => {
    openUpload()
    uploadFile(MODEL.FILENAME, uploadInput)
    clearInput(CLASSES.UPLOAD_FORM, modelTitleInput)
    enterValidValue(CLASSES.UPLOAD_FORM, modelTitleInput)
    enterValidValue(CLASSES.UPLOAD_FORM, modelDescriptionInput)
    clickOnTextInsideClass(CLASSES.UPLOAD_BUTTON_GROUP, 'Save Model')
    cy.wait(5000)
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

  it('Model has information: likes, downloads, date of upload', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    cy.wait(5000)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.LIKES)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.DOWNLOADS)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.CURRENT_YEAR)
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
    goTo(PATH.PROFILE)
    clickOnElement(CLASSES.MODEL_CARD_EDIT_BUTTON)
    clickOnElementByText(TEXT.DELETE_MODEL)
    clickOnElementByText(TEXT.CONFIRM)
    isElement(MODEL_TEST_TITLE, PROPS.INVISIBLE)
  })
})
