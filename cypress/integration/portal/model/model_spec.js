import 'cypress-file-upload'
import {
  clickOnElement,
  clickOnElementByText,
  clickOnTextInsideClass,
  deleteSingleFile,
  goTo,
  isElement,
  isTextInsideClass,
  login,
  removeModelsFoldersFromMyThangs,
} from '../../../utils/common-methods'
import {
  CLASSES,
  MODEL,
  MODEL_TEST_TITLE,
  PATH,
  PROPS,
  TEXT,
} from '../../../utils/constants'
import { commentInput, enterValidValue, TEST_USER_1 } from '../../../utils/inputs'
import { multiUpload } from '../../../utils/uploadMethods'

describe('The Model Page', () => {
  before(() => {
    removeModelsFoldersFromMyThangs()
  })

  beforeEach(() => {
    login(TEST_USER_1)
  })

  it('Check redirect to my thangs after upload of model', () => {
    multiUpload()
  })

  it('Check model for name, author and description not empty', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
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

  /*it('Check comment on previous version model page', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    isTextInsideClass(
      CLASSES.MODEL_NEW_UPLOADED_COMMENT,
      TEXT.NEW_VERSION_UPLOADED,
      PROPS.VISIBLE
    )
  })*/

  it('Model has information: likes, downloads, date of upload', () => {
    goTo(PATH.PROFILE)
    clickOnElement(MODEL_TEST_TITLE)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.LIKES)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.DOWNLOADS)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.CURRENT_YEAR)
  })

  it('Check for like/unlike button', () => {
    goTo(PATH.EXTERNAL_MODEL)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    clickOnElementByText(TEXT.LIKE)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)
    clickOnElementByText(TEXT.LIKED)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.INVISIBLE)
  })

  it('Delete model', () => {
    deleteSingleFile()
  })
})
