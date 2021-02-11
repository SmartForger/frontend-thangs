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

let activeUser

describe('The Model Page', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
      clearModelsAndFolders(activeUser)
    })
  })

  beforeEach(() => {
    loginByUser({ email: activeUser.EMAIL, password: activeUser.PASSWORD })
  })

  it('Check redirect to my thangs after upload of model', () => {
    multiUpload()
  })

  it('Check model details, comment, stats', () => {
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)

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
