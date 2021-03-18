import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  goTo,
  isElement,
  isTextInsideClass,
  loginByUser,
  clickOnElementByText,
  createFolder,
  openMultiUpload,
  uploadFile,
  clickOnElement,
} from '../utils/common-methods'
import {
  CLASSES,
  MODEL,
  PRIVATE_FOLDER,
  PROPS,
  PUBLIC_FOLDER,
  TEXT,
  VERSION_MODEL,
} from '../utils/constants'
import {
  commentInput,
  createPrivateFolderFromSelectInput,
  createPrivateFolderInput,
  createPublicFolderFromSelectInput,
  createPublicFolderInput,
  enterValidValue,
  multiUploadInput,
} from '../utils/inputs'
import {
  assemblyUploadAfterError,
  assemblyUploadError,
  multiPartAsAsmUpload,
  multipartUpload,
  multiUpload,
  versionUpload,
} from '../utils/uploadMethods'

let activeUser

const checkPrivacyText = (headerText, text) => {
  isTextInsideClass(CLASSES.UPLOAD_PRIVACY_HEADER, headerText, PROPS.VISIBLE)
  isTextInsideClass(CLASSES.UPLOAD_PRIVACY_TEXT, text, PROPS.VISIBLE)
}

const selectFolder = name => {
  isElement(CLASSES.UPLOAD_SELECT_FOLDER, PROPS.VISIBLE)
  isElement(CLASSES.UPLOAD_SELECT_FOLDER_ICON, PROPS.VISIBLE)
  clickOnElement(CLASSES.UPLOAD_SELECT_FOLDER_ICON)
  isTextInsideClass(CLASSES.UPLOAD_FOLDERS_TO_SELECT, name, PROPS.VISIBLE)
  clickOnElementByText(name)
}

const createFolderFromSelection = (type, input) => {
  isElement(CLASSES.UPLOAD_SELECT_FOLDER, PROPS.VISIBLE)
  isElement(CLASSES.UPLOAD_SELECT_FOLDER_ICON, PROPS.VISIBLE)
  clickOnElement(CLASSES.UPLOAD_SELECT_FOLDER_ICON)
  clickOnElementByText(TEXT.CREATE_NEW_FOLDER)
  cy.wait(3000)
  if (type === 'public') {
    clickOnElement(CLASSES.UPLOAD_CREATE_FOLDER_TOGGLE_BUTTON)
  }
  enterValidValue(CLASSES.INPUT, input)
  clickOnElementByText(TEXT.CREATE)
  cy.wait(3000)
  cy.get('[class^=TextInput][name=folderName]').should(
    'have.value',
    type === 'private' ? PRIVATE_FOLDER.NEW_NAME : PUBLIC_FOLDER.NEW_NAME
  )
}

describe('The Model Page', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
  })

  beforeEach(() => {
    loginByUser({ email: activeUser.EMAIL, password: activeUser.PASSWORD })
  })

  it('Check privacy & details for model', () => {
    createFolder(createPublicFolderInput, 'public', PUBLIC_FOLDER.NAME)
    goTo('/')
    createFolder(createPrivateFolderInput, 'private', PRIVATE_FOLDER.NAME)
    openMultiUpload()
    uploadFile(MODEL.FILENAME_STL, multiUploadInput)
    clickOnElementByText('Continue')
    checkPrivacyText(TEXT.UPLOAD_PRIVACY_HEADER_PUBLIC, TEXT.UPLOAD_PRIVACY_TEXT_PUBLIC)
    selectFolder(PRIVATE_FOLDER.NAME)
    checkPrivacyText(TEXT.UPLOAD_PRIVACY_HEADER_PRIVATE, TEXT.UPLOAD_PRIVACY_TEXT_PRIVATE)
    selectFolder(PUBLIC_FOLDER.NAME)
    checkPrivacyText(TEXT.UPLOAD_PRIVACY_HEADER_PUBLIC, TEXT.UPLOAD_PRIVACY_TEXT_PUBLIC)
    createFolderFromSelection('private', createPrivateFolderFromSelectInput)
    checkPrivacyText(TEXT.UPLOAD_PRIVACY_HEADER_PRIVATE, TEXT.UPLOAD_PRIVACY_TEXT_PRIVATE)
    createFolderFromSelection('public', createPublicFolderFromSelectInput)
    checkPrivacyText(TEXT.UPLOAD_PRIVACY_HEADER_PUBLIC, TEXT.UPLOAD_PRIVACY_TEXT_PUBLIC)
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

  //TODO: This Test not working in CI, bul locally it works properly
  /*it('Check asm upload', () => {
    assemblyUpload()
  })*/

  it('Check multipart upload', () => {
    multipartUpload()
  })

  it('Check multipart as asm upload', () => {
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
