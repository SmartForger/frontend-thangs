import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  goTo,
  isElement,
  isTextInsideClass,
  login,
  removeModelsFoldersFromMyThangs,
} from '../../../utils/common-methods'
import { CLASSES, MODEL, PATH, PROPS, TEXT } from '../../../utils/constants'
import { commentInput, enterValidValue, TEST_USER_1 } from '../../../utils/inputs'
import { multiUpload } from '../../../utils/uploadMethods'

const MODEL_CARD = `[title="${MODEL.TITLE}"]`

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

  it('Check model details, comment, stats', () => {
    goTo(PATH.PROFILE)
    cy.wait(3000)
    cy.get(MODEL_CARD).click()

    // check for details
    isElement(CLASSES.MODEL_PAGE_TITLE, PROPS.NOT_EMPTY)
    isElement(CLASSES.MODEL_PAGE_AUTHOR, PROPS.NOT_EMPTY)
    isElement(CLASSES.MODEL_PAGE_DESCRIPTION, PROPS.NOT_EMPTY)

    // check for comments
    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)

    // check for stats
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.LIKES)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.DOWNLOADS)
    isTextInsideClass(CLASSES.MODEL_PAGE_STATS, TEXT.CURRENT_YEAR)
  })
})
