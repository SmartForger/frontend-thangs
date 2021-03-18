import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  goTo,
  isElement,
  clearModelsAndFolders,
  loginByUser,
  clickOnElement,
  uploadFile,
  clickOnElementByText,
} from '../utils/common-methods'
import { CLASSES, MODEL, MULTIPART_MODEL, PROPS, TEXT } from '../utils/constants'
import {
  licenseUpload,
  multipartLicenseUpload,
  multiUpload,
} from '../utils/uploadMethods'
import { licenseUploadInput } from '../utils/inputs'

let activeUser

describe('The Model License', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
  })

  beforeEach(() => {
    loginByUser({ email: activeUser.EMAIL, password: activeUser.PASSWORD })
  })

  it('Check upload model without license, add it & check', () => {
    multiUpload()
    clickOnElement(CLASSES.USER_NAVBAR)
    clickOnElementByText('Public Portfolio')
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.INVISIBLE)
    clickOnElementByText(TEXT.EDIT_MODEL_BUTTON)
    cy.get('[class^=LicenseField_Field] [name=license]')
      .invoke('attr', 'placeholder')
      .should('contain', 'Attach license')
    uploadFile(MODEL.LICENSE, licenseUploadInput)
    cy.get('[class^=LicenseField_Field] [name=license]', { timeout: 5000 })
      .invoke('attr', 'placeholder')
      .should('contain', MODEL.LICENSE)
    clickOnElementByText('Save Changes')
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
    clearModelsAndFolders()
  })

  //TODO: See 'Check asm upload' test description.
  /*it('Check upload asm model with the license and license text on model page', () => {
    asmLicenseUpload()
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, ASM_MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
  })*/

  it('Check multiparts as asm model upload with the license and license text on model page', () => {
    multipartLicenseUpload()
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MULTIPART_MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
    cy.go('back')
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MULTIPART_MODEL.TITLE_2)
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
  })

  it('Check upload model with the license and license text on model page', () => {
    licenseUpload()
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
  })

  it('Check upload multipart model with the license and license text on model page', () => {
    multipartLicenseUpload()
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MULTIPART_MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
  })

  it('Check license opening, content and closing', () => {
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)

    // check for license and license link
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
    isElement(CLASSES.MODEL_LICENSE_LINK, PROPS.VISIBLE)

    // opening license
    clickOnElement(CLASSES.MODEL_LICENSE_LINK)

    // check for license title
    isElement(CLASSES.MODEL_LICENSE_TITLE_TEXT, PROPS.VISIBLE)

    // check for license owner avatar
    isElement(CLASSES.MODEL_LICENSE_OWNER_AVATAR, PROPS.VISIBLE)

    // check for license owner link
    isElement(CLASSES.MODEL_LICENSE_OWNER_LINK, PROPS.VISIBLE)

    // check license text
    isElement(CLASSES.MODEL_LICENSE_TEXT, PROPS.VISIBLE)

    // check license download
    isElement(CLASSES.MODEL_LICENSE_DOWNLOAD, PROPS.VISIBLE)

    // check close actions
    isElement(CLASSES.MODEL_LICENSE_EXIT, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_EXIT)
    isElement(CLASSES.MODEL_LICENSE_LINK, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_LINK)
    isElement(CLASSES.MODEL_LICENSE_CLOSE, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_CLOSE)
    isElement(CLASSES.MODEL_LICENSE_LINK, PROPS.VISIBLE)
  })

  it('Check update license', () => {
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.INVISIBLE)
    clickOnElementByText(TEXT.EDIT_MODEL_BUTTON)
    cy.get('[class^=LicenseField_Field] [name=license]')
      .invoke('attr', 'placeholder')
      .should('contain', MODEL.LICENSE)
    uploadFile(MODEL.LICENSE_NEW, licenseUploadInput)
    cy.get('[class^=LicenseField_Field] [name=license]', { timeout: 5000 })
      .invoke('attr', 'placeholder')
      .should('contain', MODEL.LICENSE_NEW)
    clickOnElementByText('Save Changes')
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_LINK)
  })
})
