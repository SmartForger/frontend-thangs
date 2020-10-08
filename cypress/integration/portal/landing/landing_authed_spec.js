import 'cypress-file-upload'
import {
  clickOnElement,
  isElement,
  login,
  openNotifications,
  openProfileDropdown,
  openUpload,
  uploadFile,
  urlShouldInclude,
  urlShouldIncludeAfterTimeout,
} from '../../../utils/common-methods'
import {
  clearInput,
  enterValidValue,
  inputFocus,
  inputType,
  searchInput,
  uploadInput,
} from '../../../utils/inputs'
import { CLASSES, MODEL, PATH, PROPS } from '../../constants'

describe('The Landing Page (authorized)', () => {
  beforeEach(() => {
    login()
  })

  it('Open Notifications', () => {
    openNotifications()
  })

  it('Open Profile', () => {
    openProfileDropdown()
  })

  it('Open Upload', () => {
    openUpload()
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

  it('Search by upload provides to results page', () => {
    inputFocus(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.VISIBLE)
    uploadFile(MODEL.FILENAME, uploadInput)
    urlShouldIncludeAfterTimeout(MODEL.FILENAME, 60000)
    urlShouldInclude('modelId')
    urlShouldInclude('phynId')
  })
})
