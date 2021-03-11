import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  goTo,
  isElement,
  isTextInsideClass,
  loginByUser,
  clickOnElementByText,
} from '../utils/common-methods'
import { CLASSES, MODEL, PROPS, TEXT, VERSION_MODEL } from '../utils/constants'
import { commentInput, enterValidValue } from '../utils/inputs'
import {
  assemblyUpload,
  assemblyUploadAfterError,
  assemblyUploadError,
  multiPartAsAsmUpload,
  multiUpload,
  versionUpload,
} from '../utils/uploadMethods'

let activeUser

describe('The Model Page', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
  })

  beforeEach(() => {
    loginByUser({ email: activeUser.EMAIL, password: activeUser.PASSWORD })
  })

  it('Check redirect to my thangs after upload of model', () => {
    multiUpload()
  })

  it('Check asm upload error', () => {
    assemblyUploadError()
  })

  it('Check asm upload after error', () => {
    assemblyUploadAfterError()
  })

  it('Check asm upload', () => {
    assemblyUpload()
  })

  it('Check multipart upload', () => {
    multiPartAsAsmUpload()
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

    //upload new verison
    versionUpload()
    goTo(`/${activeUser.NAME}`)
    clickOnElementByText(VERSION_MODEL.TITLE)
    cy.get('[class^=Revised_Label] a[href^="/model"]').click()
    isTextInsideClass('[class^=ModelTitle_Text]', MODEL.TITLE)
  })
})
