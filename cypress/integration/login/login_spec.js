import { CLASSES, PROPS, TEXT } from '../../utils/constants'
import {
  clickOnElement,
  clickOnElementByText,
  goTo,
  isElement,
  isTextInsideClass,
  setDynamicEmail,
  signOut,
} from '../../utils/common-methods'
import {
  clearInput,
  enterInvalidValue,
  enterValidValue,
  emailInput,
  passwordInput,
} from '../../utils/inputs'

let activeUser
export function openLogin() {
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
}

export function closeLogin() {
  isElement(CLASSES.CLOSE_LOGIN_FORM, PROPS.VISIBLE)
  clickOnElement(CLASSES.CLOSE_LOGIN_FORM)
  isElement(CLASSES.CLOSE_LOGIN_FORM, PROPS.INVISIBLE)
}

export function checkSignupLinkOnLogin() {
  isElement(CLASSES.SIGNUP_LINK_ON_LOGIN, PROPS.VISIBLE)
  clickOnElement(CLASSES.SIGNUP_LINK_ON_LOGIN)
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE) &&
    isElement(CLASSES.SIGNUP_FORM, PROPS.VISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
}

describe('The Login Page test cases with before and after conditions', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
      setDynamicEmail(emailInput, activeUser)
    })
  })
  beforeEach(() => {
    goTo('/')
    openLogin()
  })

  afterEach(() => {
    closeLogin()
  })

  it('Login overlay loaded successfully', () => {
    isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
  })

  it('Check sign up link on Login', () => {
    checkSignupLinkOnLogin()
  })

  it('Login fails with incorrect credentials', () => {
    enterInvalidValue(CLASSES.LOGIN_FORM, emailInput)
    enterInvalidValue(CLASSES.LOGIN_FORM, passwordInput)
    clickOnElement(CLASSES.LOGIN_BUTTON)
    isTextInsideClass(CLASSES.SIGNUP_LOGIN_ERROR, TEXT.LOGIN_ERROR)
    clearInput(CLASSES.LOGIN_FORM, emailInput)
    clearInput(CLASSES.LOGIN_FORM, passwordInput)
  })
})

describe('The Login Page test cases with before condition', () => {
  beforeEach(() => {
    goTo('/')
    openLogin()
  })

  it('Login form successfully closed', () => {
    closeLogin()
  })

  it('Login successfully completed', () => {
    enterValidValue(CLASSES.LOGIN_FORM, emailInput)
    enterValidValue(CLASSES.LOGIN_FORM, passwordInput)
    clickOnElement(CLASSES.LOGIN_BUTTON)
    isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
    isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
    signOut()
  })
})
