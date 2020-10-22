import {
  CLASSES,
  DATA_CY,
  MODEL_TEST_TITLE,
  PATH,
  PROPS,
  TEXT,
  MODEL,
} from './constants'
import {
  clearInput,
  enterValidValue,
  findInput,
  emailInput,
  passwordInput,
  modelDescriptionInput,
  modelTitleInput,
  emailInput2,
  passwordInput2,
} from './inputs'

export const isElement = (el, prop) => {
  cy.get(el).should(prop)
}

export const isElementContains = (element, text) => {
  cy.get(element).contains(text).should(PROPS.VISIBLE)
}

export const isElementNotEmptyAndValid = (el, prop, value) => {
  cy.get(el).should(prop).and('match', value)
}

export const clickOnElementByText = text => {
  cy.contains(text).click({ force: true })
}

export const clickOnElement = el => {
  cy.get(el).click({ force: true, multiple: true })
}

export const goTo = path => {
  cy.visit(path, { timeout: 20000 })
}

export const isTextExist = text => {
  cy.contains(text)
}

export const urlShouldInclude = path => {
  cy.url().should('include', path)
}

export const urlShouldIncludeAfterTimeout = (path, timeout) => {
  cy.url({ timeout: timeout }).should('include', path)
}

export const login = user => {
  goTo('/')
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
  enterValidValue(CLASSES.LOGIN_FORM, user.emailInput)
  enterValidValue(CLASSES.LOGIN_FORM, user.passwordInput)
  clickOnElement(CLASSES.LOGIN_BUTTON)
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
}

export const loginByUser = ({ email, password }) => {
  goTo('/')
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)

  cy.get('[data-cy=cy_email-input]').focus().type(email, { force: true })
  cy.get('[data-cy=cy_password-input]').focus().type(password, { force: true })
  
  clickOnElement(CLASSES.LOGIN_BUTTON)
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
}

export const openNotifications = () => {
  isElement(CLASSES.NOTIFICATIONS_BUTTON, PROPS.VISIBLE) &&
    isElement(CLASSES.NOTIFICATIONS_DROPDOWN, PROPS.INVISIBLE)
  clickOnElement(CLASSES.NOTIFICATIONS_BUTTON)
  isElement(CLASSES.NOTIFICATIONS_DROPDOWN, PROPS.VISIBLE)
}

export const openProfileDropdown = () => {
  isElement(CLASSES.PROFILE_BUTTON, PROPS.VISIBLE) &&
    isElement(CLASSES.PROFILE_DROPDOWN, PROPS.INVISIBLE)
  clickOnElement(CLASSES.PROFILE_BUTTON)
  isElement(CLASSES.PROFILE_DROPDOWN, PROPS.VISIBLE)
}

export const openUpload = () => {
  clickOnElementByText(TEXT.UPLOAD)
  isElement(DATA_CY.UPLOAD_OVERLAY, PROPS.VISIBLE)
}

export const openMultiUpload = () => {
  clickOnElementByText(TEXT.UPLOAD)
  isElement(DATA_CY.MULTI_UPLOAD_OVERLAY, PROPS.VISIBLE)
}

export const uploadFile = (filename, input) => {
  cy.fixture(filename, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(fileContent => {
      cy.get(input.selector).attachFile({
        fileContent,
        filePath: filename,
        encoding: 'utf-8',
      })
    })
}

export const editAndSaveFile = () => {
  clearInput(CLASSES.UPLOAD_FORM, modelTitleInput)
  enterValidValue(CLASSES.UPLOAD_FORM, modelTitleInput)
  enterValidValue(CLASSES.UPLOAD_FORM, modelDescriptionInput)
  clickOnTextInsideClass(CLASSES.UPLOAD_BUTTON_GROUP, 'Save Model')
}

export const fillAndSubmitMultiuploadForm = () => {
  isElement(DATA_CY.MULTIUPLOAD_FORM, PROPS.VISIBLE)
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=name]`).clear()
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=name]`).focus().type(MODEL.FILENAME)
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=description]`).clear()
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=description]`).focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
}

export const deleteModel = () => {
  goTo(PATH.PROFILE)
  clickOnElement(CLASSES.MODEL_CARD_EDIT_BUTTON)
  clickOnElementByText(TEXT.DELETE_MODEL)
  clickOnElementByText(TEXT.CONFIRM)
  isElement(MODEL_TEST_TITLE, PROPS.INVISIBLE)
}

export const signOut = () => {
  openProfileDropdown()
  clickOnElementByText(TEXT.SIGN_OUT)
}

export const findElement = (className, element, index = 0) => {
  return cy.get(className).then(el => {
    return new Cypress.Promise(resolve => {
      if (el.find(element)) {
        resolve(el.find(element).eq(index))
      } else {
        resolve(cy.get(el).find(element))
      }
    })
  })
}

export const clickOnElementInsideClass = (className, el) => {
  return findInput(className, el).click({ force: true, multiple: true })
}

export const clickOnTextInsideClass = (className, text) => {
  cy.get(className).contains(text).click({ force: true, multiple: true })
}

export const isTextInsideClass = (className, text, prop) => {
  prop ? cy.get(className).contains(text).should(prop) : cy.get(className).contains(text)
}