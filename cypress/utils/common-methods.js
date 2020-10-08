import { CLASSES, DATA_CY, MODEL, PROPS, TEXT } from '../integration/constants'
import {
  enterValidValue,
  findInput,
  loginEmailUsernameInput,
  loginPasswordInput,
  uploadInput,
} from './inputs'

export function isElement(el, prop) {
  cy.get(el).should(prop)
}

export function clickOnElementByText(text) {
  cy.contains(text).click({ force: true })
}

export function clickOnElement(el) {
  cy.get(el).click({ force: true, multiple: true })
}

export function goTo(path) {
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

export function login() {
  goTo('/')
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
  enterValidValue(CLASSES.LOGIN_FORM, loginEmailUsernameInput)
  enterValidValue(CLASSES.LOGIN_FORM, loginPasswordInput)
  clickOnElement(CLASSES.LOGIN_BUTTON)
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
}

export function openNotifications() {
  isElement(CLASSES.NOTIFICATIONS_BUTTON, PROPS.VISIBLE) &&
    isElement(CLASSES.NOTIFICATIONS_DROPDOWN, PROPS.INVISIBLE)
  clickOnElement(CLASSES.NOTIFICATIONS_BUTTON)
  isElement(CLASSES.NOTIFICATIONS_DROPDOWN, PROPS.VISIBLE)
}

export function openProfileDropdown() {
  isElement(CLASSES.PROFILE_BUTTON, PROPS.VISIBLE) &&
    isElement(CLASSES.PROFILE_DROPDOWN, PROPS.INVISIBLE)
  clickOnElement(CLASSES.PROFILE_BUTTON)
  isElement(CLASSES.PROFILE_DROPDOWN, PROPS.VISIBLE)
}

export function openUpload() {
  isElement(DATA_CY.UPLOAD_BUTTON, PROPS.VISIBLE)
  clickOnElement(DATA_CY.UPLOAD_BUTTON)
  isElement(DATA_CY.UPLOAD_OVERLAY, PROPS.VISIBLE)
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
