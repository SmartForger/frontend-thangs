import 'cypress-file-upload'
import {
  clickOnElement,
  clickOnTextInsideClass,
  goTo,
  isElement,
  isElementContains,
  urlShouldInclude,
} from '../utils/common-methods'
import {
  clearInput,
  enterValidValue,
  inputFocus,
  inputType,
  searchInput,
} from '../utils/inputs'
import { CLASSES, PATH, PROPS, TEXT } from '../utils/constants'

describe('The Landing Page', () => {
  beforeEach(() => {
    goTo('/')
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
    uploadFile(MODEL.FILENAME_STL, uploadInput)
    urlShouldIncludeAfterTimeout(MODEL.FILENAME_STL, 180000)
    urlShouldInclude('modelId')
    urlShouldInclude('phynId')
  })
  */

  it('Click on filters', () => {
    isElement(CLASSES.LANDING_FILTER_BUTTON, PROPS.VISIBLE)
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_BUTTON, TEXT.TRENDING)
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_DROPDOWN, TEXT.POPULAR)
    isElementContains(CLASSES.LANDING_TITLE, 'Popular Models')
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_BUTTON, TEXT.POPULAR)
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_DROPDOWN, TEXT.TRENDING)
    isElementContains(CLASSES.LANDING_TITLE, 'Trending Models')
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_BUTTON, TEXT.TRENDING)
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_DROPDOWN, TEXT.NEW)
    isElementContains(CLASSES.LANDING_TITLE, 'New Models')
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_BUTTON, TEXT.NEW)
    clickOnTextInsideClass(CLASSES.LANDING_FILTER_DROPDOWN, TEXT.DOWNLOADS)
    isElementContains(CLASSES.LANDING_TITLE, 'Most Downloaded')
  })

  it('Landing search "#geotests" provides to results page', () => {
    const searchBar = '[class^=Header_DesktopOnly] [name=search]'

    isElement(searchBar, PROPS.VISIBLE)
    cy.get(searchBar).focus().type('#geotests', { force: true })
    clickOnElement(CLASSES.SEARCH_BAR_BUTTON)
    urlShouldInclude(`${PATH.SEARCH}%23geotests`)
    isElement(CLASSES.RESULT_COUNT_TEXT, PROPS.VISIBLE)
    isElementContains(
      CLASSES.RESULT_COUNT_TEXT,
      /At least (?:\d+) results for "#geotests".?/
    )
  })
})
