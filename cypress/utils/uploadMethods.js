import 'cypress-file-upload'
import {
  CLASSES,
  TEXT,
  MODEL,
  PATH,
  VERSION_MODEL,
  PROPS,
  ASM_MODEL,
  MULTIPART_MODEL,
} from './constants'
import {
  clickOnElement,
  clickOnElementByText,
  clickOnTextInsideClass,
  goTo,
  isElement,
  isElementContains,
  openMultiUpload,
  uploadFile,
  urlShouldIncludeAfterTimeout,
} from './common-methods'
import { licenseUploadInput, multiUploadInput } from './inputs'

export const multiUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME_STL, multiUploadInput)
  clickOnElementByText('Continue')
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MODEL.TITLE)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]').focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, MODEL.TITLE)
}

export const assemblyUploadError = () => {
  openMultiUpload()
  uploadFile(ASM_MODEL.FILENAME, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.VISIBLE)
  isElementContains(CLASSES.UPLOAD_ERROR_TEXT, 'Assembly require at least 1 part file')
}

export const assemblyUploadAfterError = () => {
  openMultiUpload()
  uploadFile(ASM_MODEL.FILENAME, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.VISIBLE)
  isElementContains(CLASSES.UPLOAD_ERROR_TEXT, 'Assembly require at least 1 part file')
  uploadFile(ASM_MODEL.FILENAME_PART_1, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.INVISIBLE)
  clickOnElementByText('Continue')
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(ASM_MODEL.TITLE)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(ASM_MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, ASM_MODEL.TITLE)
}

export const assemblyUpload = () => {
  openMultiUpload()
  uploadFile(ASM_MODEL.FILENAME, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.INVISIBLE)
  uploadFile(ASM_MODEL.FILENAME_PART_1, multiUploadInput)
  isElement(CLASSES.UPLOAD_WARNING_TEXT, PROPS.VISIBLE)
  isElementContains(CLASSES.UPLOAD_WARNING_TEXT, TEXT.UPLOAD_WARNING_TEXT)
  isElementContains(CLASSES.BUTTON, 'Continue').should('not.be.disabled')
  clickOnElementByText('Continue')
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(ASM_MODEL.TITLE)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(ASM_MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Part')
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, ASM_MODEL.TITLE)
}

export const multiPartAsAsmUpload = () => {
  openMultiUpload()
  uploadFile(MULTIPART_MODEL.FILENAME_1, multiUploadInput)
  uploadFile(MULTIPART_MODEL.FILENAME_2, multiUploadInput)
  clickOnElement(CLASSES.MY_THANGS_FOLDER_FORM_TOGGLE_BUTTON)
  clickOnElementByText('Continue')
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(MULTIPART_MODEL.TITLE)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(MULTIPART_MODEL.DESCRIPTION)
  clickOnTextInsideClass('[class^=Dropdown]', 'Select primary model *')
  isElementContains('[class^=Dropdown]', MULTIPART_MODEL.FILENAME_2)
  clickOnTextInsideClass('[class^=Dropdown]', MULTIPART_MODEL.FILENAME_2)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, MULTIPART_MODEL.TITLE)
}

export const licenseUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME_STL, multiUploadInput)
  clickOnElementByText('Continue')
  uploadFile(MODEL.LICENSE, licenseUploadInput)
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MODEL.TITLE)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]').focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, MODEL.TITLE)
}

export const asmLicenseUpload = () => {
  openMultiUpload()
  uploadFile(ASM_MODEL.FILENAME, multiUploadInput)
  uploadFile(ASM_MODEL.FILENAME_PART_1, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.INVISIBLE)
  isElement(CLASSES.UPLOAD_WARNING_TEXT, PROPS.VISIBLE)
  isElementContains(CLASSES.UPLOAD_WARNING_TEXT, TEXT.UPLOAD_WARNING_TEXT)
  isElementContains(CLASSES.BUTTON, 'Continue').should('not.be.disabled')
  clickOnElementByText('Continue', { timeout: 5000 })
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  uploadFile(MODEL.LICENSE, licenseUploadInput)
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(ASM_MODEL.TITLE)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(ASM_MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Part')
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, ASM_MODEL.TITLE)
}

export const multipartAsAsmLicenseUpload = () => {
  openMultiUpload()
  uploadFile(MULTIPART_MODEL.FILENAME_1, multiUploadInput)
  uploadFile(MULTIPART_MODEL.FILENAME_2, multiUploadInput)
  clickOnElement(CLASSES.MY_THANGS_FOLDER_FORM_TOGGLE_BUTTON)
  clickOnElementByText('Continue')
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  uploadFile(ASM_MODEL.LICENSE, licenseUploadInput)
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(MULTIPART_MODEL.TITLE)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(MULTIPART_MODEL.DESCRIPTION)
  clickOnTextInsideClass('[class^=Dropdown]', 'Select primary model *')
  isElementContains('[class^=Dropdown]', MULTIPART_MODEL.FILENAME_2)
  clickOnTextInsideClass('[class^=Dropdown]', MULTIPART_MODEL.FILENAME_2)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, MULTIPART_MODEL.TITLE)
}

export const multipartUpload = () => {
  openMultiUpload()
  uploadFile(MULTIPART_MODEL.FILENAME_1, multiUploadInput)
  uploadFile(MULTIPART_MODEL.FILENAME_2, multiUploadInput)
  clickOnElementByText('Continue')
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MULTIPART_MODEL.TITLE)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]')
    .focus()
    .type(MULTIPART_MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MULTIPART_MODEL.TITLE_2)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]')
    .focus()
    .type(MULTIPART_MODEL.DESCRIPTION_2)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains('[class^=FileTable_Row]', MULTIPART_MODEL.TITLE)
  isElementContains('[class^=FileTable_Row]', MULTIPART_MODEL.TITLE_2)
}

export const multipartLicenseUpload = () => {
  openMultiUpload()
  uploadFile(MULTIPART_MODEL.FILENAME_1, multiUploadInput)
  uploadFile(MULTIPART_MODEL.FILENAME_2, multiUploadInput)
  clickOnElementByText('Continue')
  uploadFile(MULTIPART_MODEL.LICENSE, licenseUploadInput)
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MULTIPART_MODEL.TITLE)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]')
    .focus()
    .type(MULTIPART_MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  uploadFile(MULTIPART_MODEL.LICENSE, licenseUploadInput)
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MULTIPART_MODEL.TITLE_2)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]')
    .focus()
    .type(MULTIPART_MODEL.DESCRIPTION_2)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, MULTIPART_MODEL.TITLE)
  // isElementContains('[class^=FileTable_Row]', MULTIPART_MODEL.TITLE_2)
}

export const versionUpload = () => {
  clickOnElementByText('Upload new version')
  uploadFile(VERSION_MODEL.FILENAME, multiUploadInput)
  clickOnElementByText('Continue')
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(VERSION_MODEL.TITLE)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]')
    .focus()
    .type(VERSION_MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
  urlShouldIncludeAfterTimeout(PATH.MY_THANGS_MODEL)
  isElementContains(CLASSES.TITLE, VERSION_MODEL.TITLE)
  cy.get(CLASSES.TITLE).should('not.contain', '-')
}

export const deleteModel = (modelName = MODEL.TITLE) => {
  goTo(PATH.MY_THANGS_ALL_FILES)
  clickOnElement(`[title="${modelName}"] [class^=MenuButton]`)
  clickOnElementByText(TEXT.REMOVE)
  clickOnTextInsideClass(CLASSES.DELETE_MODEL_BUTTON, TEXT.DELETE)
}
