import 'cypress-file-upload'
import { CLASSES, TEXT, MODEL, PATH, VERSION_MODEL } from './constants'
import {
  clickOnElement,
  clickOnElementByText,
  clickOnTextInsideClass,
  goTo,
  isElementContains,
  openMultiUpload,
  uploadFile,
  urlShouldIncludeAfterTimeout,
} from './common-methods'
import { licenseUploadInput, multiUploadInput } from './inputs'

export const multiUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME, multiUploadInput)
  clickOnElementByText('Continue')
  cy.get('[class^=PartInfo_Field] [name=name]').clear()
  cy.get('[class^=PartInfo_Field] [name=name]').focus().type(MODEL.TITLE)
  cy.get('[class^=PartInfo_Field] [name=description]').clear()
  cy.get('[class^=PartInfo_Field] [name=description]').focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
  urlShouldIncludeAfterTimeout('mythangs/recent-files', 10000)
  isElementContains('[class^=FileTable_Row]', MODEL.TITLE)
}

export const licenseUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME, multiUploadInput)
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
  cy.get(`[class^=PartInfo_Field] [name=name]`).clear()
  cy.get(`[class^=PartInfo_Field] [name=name]`).focus().type(VERSION_MODEL.TITLE)
  cy.get(`[class^=PartInfo_Field] [name=description]`).clear()
  cy.get(`[class^=PartInfo_Field] [name=description]`)
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
