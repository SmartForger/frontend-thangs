import 'cypress-file-upload'
import {
  clickOnElement,
  clickOnTextInsideClass,
  goTo,
  isElement,
  isElementContains,
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
import { CLASSES, MODEL, PATH, PROPS, TEXT } from '../../../utils/constants'

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

  it('Search by upload provides to results page', () => {
    inputFocus(CLASSES.HEADER_DESKTOP, searchInput)
    isElement(CLASSES.LANDING_SEARCH_BAR_UPLOAD, PROPS.VISIBLE)
    uploadFile(MODEL.FILENAME, uploadInput)
    urlShouldIncludeAfterTimeout(MODEL.FILENAME, 180000)
    urlShouldInclude('modelId')
    urlShouldInclude('phynId')
  })

  it('Click on filters', () => {
    isElement(CLASSES.FILTER_TABS, PROPS.VISIBLE)
    clickOnTextInsideClass(CLASSES.FILTER_TABS, TEXT.DOWNLOADS)
    clickOnTextInsideClass(CLASSES.FILTER_TABS, TEXT.POPULAR)
    clickOnTextInsideClass(CLASSES.FILTER_TABS, TEXT.NEW)
  })

  it('Landing search "#geotests" provides to results page', () => {
    const searchBar = '[class^=Header_DesktopOnly] [name=search]'

    isElement(searchBar, PROPS.VISIBLE)
    cy.get(searchBar).focus().type('#geotests', { force: true })
    clickOnElement(CLASSES.SEARCH_BAR_BUTTON)
    urlShouldInclude(`${PATH.SEARCH}%23geotests`)
    isElementContains('[class^=SearchResults_HeaderText]', 'Search Results for #geotests')
  })
})
