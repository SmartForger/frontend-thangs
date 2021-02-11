import 'cypress-file-upload'
import {
  clickOnElement,
  isElement,
  login,
  openMultiUpload,
  openNotifications,
  openProfileDropdown,
  setDynamicEmail,
  signOut,
  uploadFile,
  urlShouldInclude,
  urlShouldIncludeAfterTimeout,
} from '../../utils/common-methods'
import {
  clearInput,
  emailInput,
  enterValidValue,
  inputFocus,
  inputType,
  searchInput,
  TEST_USER_1,
  uploadInput,
} from '../../utils/inputs'
import { CLASSES, MODEL, PATH, PROPS } from '../../utils/constants'

let activeUser

describe('The Landing Page (authorized)', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
      setDynamicEmail(TEST_USER_1.emailInput, activeUser)
    })
  })
  beforeEach(() => {
    login(TEST_USER_1)
  })

  it('Open Notifications', () => {
    openNotifications()
  })

  it('Open Profile', () => {
    openProfileDropdown()
  })

  it('Open Upload', () => {
    openMultiUpload()
  })

  it('Text search provides to results page', () => {
    isElement(searchInput.selector, PROPS.VISIBLE)
    enterValidValue(CLASSES.HEADER_DESKTOP, searchInput)
    clickOnElement(CLASSES.SEARCH_BAR_BUTTON)
    urlShouldInclude(PATH.SEARCH + searchInput.validInput)
  })

  it('Upload search bar appears after search input focus', () => {
    isElement(searchInput.selector, PROPS.VISIBLE)
    inputFocus(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.VISIBLE)
  })

  it('Upload search bar disappears when text in search input', () => {
    inputFocus(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.VISIBLE)
    inputType(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.INVISIBLE)
    clearInput(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.VISIBLE)
  })

  // Blocked by BE
  /*
  it('Search by upload provides to results page', () => {
    inputFocus(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.VISIBLE)
    uploadFile(MODEL.FILENAME, uploadInput)
    urlShouldIncludeAfterTimeout(MODEL.FILENAME, 180000)
    urlShouldInclude('modelId')
    urlShouldInclude('phynId')
  })
  */
})
