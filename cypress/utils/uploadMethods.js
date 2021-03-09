import 'cypress-file-upload'
import { CLASSES, TEXT, MODEL, PATH, VERSION_MODEL, PROPS } from './constants'
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
  urlShouldIncludeAfterTimeout('mythangs/recent-files', 10000)
  isElementContains('[class^=FileTable_Row]', MODEL.TITLE)
}

export const assemblyUploadError = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME_ASM, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.VISIBLE)
  isElementContains(CLASSES.UPLOAD_ERROR_TEXT, 'Assembly require at least 1 part file')
}

export const assemblyUploadAfterError = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME_ASM, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.VISIBLE)
  isElementContains(CLASSES.UPLOAD_ERROR_TEXT, 'Assembly require at least 1 part file')
  uploadFile(MODEL.FILENAME_ASM_PART_1, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.INVISIBLE)
  clickOnElementByText('Continue')
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
}

export const assemblyUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME_ASM, multiUploadInput)
  uploadFile(MODEL.FILENAME_ASM_PART_1, multiUploadInput)
  isElement(CLASSES.UPLOAD_ERROR_TEXT, PROPS.INVISIBLE)
  clickOnElementByText('Continue')
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(MODEL.TITLE_ASM)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Part')
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout('mythangs/recent-files', 10000)
  isElementContains('[class^=FileTable_Row]', MODEL.TITLE_ASM)
}

export const multiPartAsAsmUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME_MULTIPART_1, multiUploadInput)
  uploadFile(MODEL.FILENAME_MULTIPART_2, multiUploadInput)
  clickOnElement(CLASSES.MY_THANGS_FOLDER_FORM_TOGGLE_BUTTON)
  clickOnElementByText('Continue')
  isElementContains(CLASSES.UPLOAD_HEADER, 'New Assembly')
  cy.get('[class^=Input] [name=name]').clear()
  cy.get('[class^=Input] [name=name]').focus().type(MODEL.TITLE_MULTIPART)
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]').clear()
  cy.get('[class^=AssemblyInfo_TextAreaInput] [name=description]')
    .focus()
    .type(MODEL.DESCRIPTION)
  clickOnTextInsideClass('[class^=Dropdown]', 'Select primary model *')
  isElementContains('[class^=Dropdown]', MODEL.FILENAME_MULTIPART_2)
  clickOnTextInsideClass('[class^=Dropdown]', MODEL.FILENAME_MULTIPART_2)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue', { timeout: 3000 })
  urlShouldIncludeAfterTimeout('mythangs/recent-files', 10000)
  isElementContains('[class^=FileTable_Row]', MODEL.TITLE_MULTIPART)
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
  urlShouldIncludeAfterTimeout('mythangs/recent-files', 10000)
  isElementContains('[class^=FileTable_Row]', MODEL.TITLE)
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
  urlShouldIncludeAfterTimeout('mythangs/recent-files', 10000)
  isElementContains('[class^=FileTable_Row]', VERSION_MODEL.TITLE)
  cy.get('[class^=FileTable_Row_Column] a[href^="/model"]').should('not.contain', '-')
}

export const deleteModel = (modelName = MODEL.TITLE) => {
  goTo(PATH.MY_THANGS_ALL_FILES)
  clickOnElement(`[title="${modelName}"] [class^=MenuButton]`)
  clickOnElementByText(TEXT.REMOVE)
  clickOnTextInsideClass(CLASSES.DELETE_MODEL_BUTTON, TEXT.DELETE)
}
