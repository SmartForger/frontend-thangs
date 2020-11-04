import 'cypress-file-upload'
import { CLASSES, DATA_CY, PROPS, TEXT, MODEL, PATH } from './constants'
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
import { multiUploadInput } from './inputs'

export const multiUpload = () => {
  openMultiUpload()
  uploadFile(MODEL.FILENAME, multiUploadInput)
  clickOnElementByText('Continue')
  isElement(DATA_CY.MULTIUPLOAD_FORM, PROPS.VISIBLE)
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=name]`).clear()
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=name]`).focus().type(MODEL.TITLE)
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=description]`).clear()
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=description]`).focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
  urlShouldIncludeAfterTimeout('mythangs/all-files', 10000)
  isElementContains('[class *="FileTable_FileName"]', MODEL.TITLE)
}

export const deleteModel = (modelName = MODEL.TITLE) => {
  goTo(PATH.ALL_FILES)
  clickOnElement(`[title="${modelName}"] [class^=MenuButton]`)
  clickOnElementByText(TEXT.REMOVE)
  clickOnTextInsideClass(CLASSES.DELETE_MODEL_BUTTON, TEXT.DELETE)
}
