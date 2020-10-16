import { CLASSES, PROPS, TEXT } from '../../constants'
import {
  clickOnElement,
  clickOnElementByText,
  isElement,
  isTextInsideClass,
} from '../../../utils/common-methods'
import {
  clearInput,
  enterInvalidValue,
  enterValidValue,
  emailInput,
  passwordInput,
  usernameInput,
  confirmPasswordInput,
  enterWrongValue,
} from '../../../utils/inputs'

export function openSignup() {
  isElement(CLASSES.SIGNUP_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.SIGN_UP)
  isElement(CLASSES.SIGNUP_FORM, PROPS.VISIBLE)
}

export function closeSignup() {
  isElement(CLASSES.CLOSE_SIGNUP_FORM, PROPS.VISIBLE)
  clickOnElement(CLASSES.CLOSE_SIGNUP_FORM)
  isElement(CLASSES.CLOSE_SIGNUP_FORM, PROPS.INVISIBLE)
}

export function checkLoginLinkOnSignup() {
  isElement(CLASSES.LOGIN_LINK_ON_SIGNUP, PROPS.VISIBLE)
  clickOnElement(CLASSES.LOGIN_LINK_ON_SIGNUP)
  isElement(CLASSES.SIGNUP_FORM, PROPS.INVISIBLE) &&
    isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
  clickOnElementByText(TEXT.SIGN_UP)
}

describe('The Signup Page test cases with before and after conditions', () => {
  beforeEach(() => {
    openSignup()
  })

  afterEach(() => {
    closeSignup()
  })

  it('Signup overlay loaded successfully', () => {
    isElement(CLASSES.SIGNUP_FORM, PROPS.VISIBLE)
  })

  it('Check log in link on Signup', () => {
    checkLoginLinkOnSignup()
  })

  it('Signup fails with wrong email', () => {
    enterValidValue(CLASSES.SIGNUP_FORM, usernameInput)
    enterWrongValue(CLASSES.SIGNUP_FORM, emailInput)
    enterValidValue(CLASSES.SIGNUP_FORM, passwordInput)
    enterValidValue(CLASSES.SIGNUP_FORM, confirmPasswordInput)
    clickOnElement(CLASSES.SIGNUP_BUTTON)
    isTextInsideClass(CLASSES.SIGNUP_LOGIN_ERROR, TEXT.SIGNUP_EMAIL_ERROR)
  })

  it('Signup fails with wrong password confirmation', () => {
    enterValidValue(CLASSES.SIGNUP_FORM, usernameInput)
    enterValidValue(CLASSES.SIGNUP_FORM, emailInput)
    enterValidValue(CLASSES.SIGNUP_FORM, passwordInput)
    enterInvalidValue(CLASSES.SIGNUP_FORM, confirmPasswordInput)
    clickOnElement(CLASSES.SIGNUP_BUTTON)
    isTextInsideClass(CLASSES.SIGNUP_LOGIN_ERROR, TEXT.SIGNUP_CONFIRM_PASS_ERROR)
  })
})

/*
describe('The Signup Page test cases with before condition', () => {
  beforeEach(() => {
    openSignup()
  })

  it('Signup form successfully closed', () => {
    closeSignup()
  })

  it('Signup successfully completed', () => {
    enterValidValue(CLASSES.LOGIN_FORM, emailInput)
    enterValidValue(CLASSES.LOGIN_FORM, passwordInput)
    clickOnElement(CLASSES.LOGIN_BUTTON)
    isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
    isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
  })
})
*/
