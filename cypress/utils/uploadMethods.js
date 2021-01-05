import 'cypress-file-upload'
import { CLASSES, TEXT, MODEL, PATH } from './constants'
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
import { multiUploadInput } from './inputs'

export const multiUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME, multiUploadInput)
  clickOnElementByText('Continue')
  cy.get(`[class^=PartInfo_Field] [name=name]`).clear()
  cy.get(`[class^=PartInfo_Field] [name=name]`).focus().type(MODEL.TITLE)
  cy.get(`[class^=PartInfo_Field] [name=description]`).clear()
  cy.get(`[class^=PartInfo_Field] [name=description]`).focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
  urlShouldIncludeAfterTimeout('mythangs/all-files', 10000)
  isElementContains('[class^=FileTable_Row]', MODEL.TITLE)
}

export const deleteModel = (modelName = MODEL.TITLE) => {
  goTo(PATH.MY_THANGS_ALL_FILES)
  clickOnElement(`[title="${modelName}"] [class^=MenuButton]`)
  clickOnElementByText(TEXT.REMOVE)
  clickOnTextInsideClass(CLASSES.DELETE_MODEL_BUTTON, TEXT.DELETE)
}
