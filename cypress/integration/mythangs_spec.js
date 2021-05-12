import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  deleteSingleFile,
  goTo,
  isElement,
  openMyThangs,
  loginByUser,
  createFolder,
} from '../utils/common-methods'
import {
  CLASSES,
  PUBLIC_FOLDER,
  PATH,
  PROPS,
  TEXT,
  PRIVATE_FOLDER,
} from '../utils/constants'
import { createPrivateFolderInput, createPublicFolderInput } from '../utils/inputs'

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
    createFolder(createPublicFolderInput, 'public', PUBLIC_FOLDER.NAME)
    deleteSingleFile()
  })

  it('Create private folder', () => {
    createFolder(createPrivateFolderInput, 'private', PRIVATE_FOLDER.NAME)
    deleteSingleFile()
  })
})
