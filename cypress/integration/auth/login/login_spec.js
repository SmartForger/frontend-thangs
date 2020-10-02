import { DATA_CY, PROPS, TEXT, USER } from '../../constants'
import {
  clearField,
  clickOnElementByDataCy,
  clickOnElementByText,
  fillInputWithText,
  isElement,
  isTextExist,
  submitForm,
} from '../../common-methods'

export function openLogin() {
  isElement(DATA_CY.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(DATA_CY.LOGIN_FORM, PROPS.VISIBLE)
}

export function closeLogin() {
  isElement(DATA_CY.CLOSE_LOGIN_FORM, PROPS.VISIBLE)
  clickOnElementByDataCy(DATA_CY.CLOSE_LOGIN_FORM)
  isElement(DATA_CY.CLOSE_LOGIN_FORM, PROPS.INVISIBLE)
}

export function checkSignupLinkOnLogin() {
  isElement(DATA_CY.SIGNUP_LINK_ON_LOGIN, PROPS.VISIBLE)
  clickOnElementByDataCy(DATA_CY.SIGNUP_LINK_ON_LOGIN)
  isElement(DATA_CY.LOGIN_FORM, PROPS.INVISIBLE) &&
    isElement(DATA_CY.SIGNUP_FORM, PROPS.VISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
}

describe('The Login Page test cases with before and after conditions', () => {
  beforeEach(() => {
    openLogin()
  })

  afterEach(() => {
    closeLogin()
  })

  it('Login overlay loaded successfully', () => {
    isElement(DATA_CY.LOGIN_FORM, PROPS.VISIBLE)
  })

  it('Check sign up link on Login', () => {
    checkSignupLinkOnLogin()
  })

  it('Login fails with incorrect credentials', () => {
    fillInputWithText(DATA_CY.LOGIN_EMAIL_INPUT, USER.EMAIL)
    fillInputWithText(DATA_CY.LOGIN_PASSWORD_INPUT, USER.INVALID_PASSWORD)
    submitForm(DATA_CY.LOGIN_FORM)
    isElement(DATA_CY.LOGIN_FORM_ERROR, PROPS.VISIBLE)
    isTextExist('Invalid user ID or password.')
    clearField(DATA_CY.LOGIN_EMAIL_INPUT)
    clearField(DATA_CY.LOGIN_PASSWORD_INPUT)
  })
})

describe('The Login Page test cases with before condition', () => {
  beforeEach(() => {
    openLogin()
  })

  it('Login form successfully closed', () => {
    closeLogin()
  })

  it('Login successfully completed', () => {
    fillInputWithText(DATA_CY.LOGIN_EMAIL_INPUT, USER.EMAIL)
    fillInputWithText(DATA_CY.LOGIN_PASSWORD_INPUT, USER.PASSWORD)
    submitForm(DATA_CY.LOGIN_FORM)
    isElement(DATA_CY.LOGIN_FORM, PROPS.VISIBLE)
    isElement(DATA_CY.USER_NAVBAR, PROPS.VISIBLE)
  })
})
