import 'cypress-file-upload'
import {
  clickOnElement,
  clickOnTextInsideClass,
  deleteSingleFile,
  goTo,
  isElement,
  isTextInsideClass,
  openMyThangs,
  clearModelsAndFolders,
  loginByUser,
} from '../../utils/common-methods'
import { CLASSES, FOLDER, PATH, PROPS, TEXT, USER3 } from '../../utils/constants'
import { createFolderInput, enterValidValue } from '../../utils/inputs'

let activeUser

describe('My Thangs Page', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
  })

  beforeEach(() => {
    loginByUser({ email: activeUser.EMAIL, password: activeUser.PASSWORD })
  })

  after(() => {
    clearModelsAndFolders(activeUser)
  })

  it('My Thangs page loaded successfully', () => {
    goTo(PATH.MY_THANGS)
    isElement(CLASSES.MY_THANGS_NAVBAR, PROPS.VISIBLE)
    isElement(CLASSES.MY_THANGS_RECENT_FILES, PROPS.VISIBLE)
  })

  it('My Thangs page loaded successfully from profile dropdown', () => {
    openMyThangs()
  })

  it('Check Add new button', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.ADD_NEW)
    isElement(CLASSES.MY_THANGS_ADD_MENU, PROPS.VISIBLE)
  })

  it('Check Shared', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.SHARED)
    isElement(CLASSES.MY_THANGS_SHARED_FILES, PROPS.VISIBLE)
  })

  it('Check Liked Models', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.LIKED_MODELS)
    isElement(CLASSES.MY_THANGS_LIKED_MODELS, PROPS.VISIBLE)
  })

  it('Check Saved Searches', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.SAVED_SEARCHES)
    isElement(CLASSES.MY_THANGS_SAVED_SEARCHES, PROPS.VISIBLE)
  })

  it('Check Profile Settings', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.PROFILE_SETTINGS)
    isElement(CLASSES.MY_THANGS_EDIT_PROFILE, PROPS.VISIBLE)
  })

  it('Check Sign Out', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.SIGN_OUT)
    isElement(CLASSES.USER_NAVBAR, PROPS.INVISIBLE)
  })

  it('Create public folder', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.ADD_NEW)
    isElement(CLASSES.MY_THANGS_ADD_MENU, PROPS.VISIBLE)
    clickOnTextInsideClass(CLASSES.MY_THANGS_ADD_MENU, TEXT.CREATE_FOLDER)
    isElement(CLASSES.MY_THANGS_ADD_FOLDER, PROPS.VISIBLE)
    enterValidValue(CLASSES.MY_THANGS_INPUT, createFolderInput)
    clickOnTextInsideClass(CLASSES.MY_THANGS_FOLDER_FORM_BUTTONS, TEXT.SAVE)
    isTextInsideClass(CLASSES.MY_THANGS_FOLDER_VIEW_ROW, FOLDER.NAME, PROPS.VISIBLE)
    deleteSingleFile()
  })

  it('Create private folder', () => {
    openMyThangs()
    clickOnTextInsideClass(CLASSES.MY_THANGS_NAVBAR, TEXT.ADD_NEW)
    isElement(CLASSES.MY_THANGS_ADD_MENU, PROPS.VISIBLE)
    clickOnTextInsideClass(CLASSES.MY_THANGS_ADD_MENU, TEXT.CREATE_FOLDER)
    isElement(CLASSES.MY_THANGS_ADD_FOLDER, PROPS.VISIBLE)
    enterValidValue(CLASSES.MY_THANGS_INPUT, createFolderInput)
    clickOnElement(CLASSES.MY_THANGS_FOLDER_FORM_TOGGLE_BUTTON)
    clickOnTextInsideClass(CLASSES.MY_THANGS_FOLDER_FORM_BUTTONS, TEXT.SAVE)
    isTextInsideClass(CLASSES.MY_THANGS_FOLDER_VIEW_ROW, FOLDER.NAME, PROPS.VISIBLE)
    isElement(CLASSES.MY_THANGS_FOLDER_PRIVATE, PROPS.VISIBLE)
    deleteSingleFile()
  })
})
