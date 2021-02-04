import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  goTo,
  isElement,
  isTextInsideClass,
  clearModelsAndFolders,
  loginByUser,
} from '../../utils/common-methods'
import { CLASSES, MODEL, USER3, PROPS, TEXT, MODEL_CARD } from '../../utils/constants'
import { commentInput, enterValidValue } from '../../utils/inputs'
import { multiUpload } from '../../utils/uploadMethods'

const user = USER3

describe('The Model Page', () => {
  before(() => {
    clearModelsAndFolders(user)
  })

  beforeEach(() => {
    loginByUser({ email: user.EMAIL, password: user.PASSWORD })
  })

  it('Check redirect to my thangs after upload of model', () => {
    multiUpload()
  })

  it('Check model details, comment, stats', () => {
    goTo(`/${user.NAME}`)
    cy.get(MODEL_CARD(), { timeout: 2000 }).click()

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
