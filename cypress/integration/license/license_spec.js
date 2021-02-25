import 'cypress-file-upload'
import {
  clickOnTextInsideClass,
  goTo,
  isElement,
  clearModelsAndFolders,
  loginByUser,
  clickOnElement,
} from '../../utils/common-methods'
import { CLASSES, MODEL, PROPS } from '../../utils/constants'
import { licenseUpload } from '../../utils/uploadMethods'

let activeUser

describe('The Model Page', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
  })

  beforeEach(() => {
    loginByUser({ email: activeUser.EMAIL, password: activeUser.PASSWORD })
  })

  after(() => {
    clearModelsAndFolders(activeUser)
  })

  it('Check upload model with the license and license text on model page', () => {
    licenseUpload()
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
  })

  it('Check license opening, content and closing', () => {
    goTo(`/${activeUser.NAME}`)
    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)

    // check for license and license link
    isElement(CLASSES.MODEL_LICENSE, PROPS.VISIBLE)
    isElement(CLASSES.MODEL_LICENSE_LINK, PROPS.VISIBLE)

    // opening license
    clickOnElement(CLASSES.MODEL_LICENSE_LINK)

    // check for license title
    isElement(CLASSES.MODEL_LICENSE_TITLE_TEXT, PROPS.VISIBLE)

    // check for license owner avatar
    isElement(CLASSES.MODEL_LICENSE_OWNER_AVATAR, PROPS.VISIBLE)

    // check for license owner link
    isElement(CLASSES.MODEL_LICENSE_OWNER_LINK, PROPS.VISIBLE)

    // check license text
    isElement(CLASSES.MODEL_LICENSE_TEXT, PROPS.VISIBLE)

    // check license download
    isElement(CLASSES.MODEL_LICENSE_DOWNLOAD, PROPS.VISIBLE)

    // check close actions
    isElement(CLASSES.MODEL_LICENSE_EXIT, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_EXIT)
    isElement(CLASSES.MODEL_LICENSE_LINK, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_LINK)
    isElement(CLASSES.MODEL_LICENSE_CLOSE, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_LICENSE_CLOSE)
    isElement(CLASSES.MODEL_LICENSE_LINK, PROPS.VISIBLE)
  })
})
