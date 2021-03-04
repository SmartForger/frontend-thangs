import {
  goTo,
  isTextInsideClass,
  loginByUser,
  isElementContains,
  clearModelsAndFolders,
} from '../utils/common-methods'
import { multiUpload } from '../utils/uploadMethods'

const FIRST_NAME_TEXT = 'FirstTestName'
const LAST_NAME_TEXT = 'LastTestName'
const DESCRIPTION_TEXT = 'Bio Here'

let activeUser
let sideUser

describe('Profile', () => {
  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
    cy.getCookie('sideUser').then(({ value }) => {
      sideUser = JSON.parse(value)
    })
  })

  after(() => {
    clearModelsAndFolders(activeUser)
  })

  it('Side user upploads model', () => {
    loginByUser({
      email: sideUser.EMAIL,
      password: sideUser.PASSWORD,
    })
    multiUpload()
  })

  it('Active user likes', () => {
    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })
    goTo(`/${sideUser.NAME}`)

    cy.intercept('/like').as('likeRequest')
    cy.get('[class^=ModelCard_ActivityCount][title=Like]').click()

    cy.wait('@likeRequest').its('response.statusCode').should('eq', 200)
  })

  it('Active user redirects to other portfolio', () => {
    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })
    goTo(`/${activeUser.NAME}`)

    cy.get('[class^=Home_Row] [class^=BodyText]')
      .contains('Likes', { timeout: 10000 })
      .click()

    cy.get('[class^=ModelCard_UserLine]', { timeout: 10000 }).click()

    isElementContains('[class^=Profile_Header] [class^=Profile_Name]', sideUser.NAME)
  })

  it('User data updates after edit', () => {
    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })
    goTo('/mythangs/edit-profile')

    cy.get('[class^=EditProfileForm] [name=firstName]').clear()
    cy.get('[class^=EditProfileForm] [name=firstName]').focus().type(FIRST_NAME_TEXT)
    cy.get('[class^=EditProfileForm] [name=lastName]').clear()
    cy.get('[class^=EditProfileForm] [name=lastName]').focus().type(LAST_NAME_TEXT)
    cy.get('[class^=EditProfileForm] [name=description]').clear()
    cy.get('[class^=EditProfileForm] [name=description]').focus().type(DESCRIPTION_TEXT)

    cy.get('form[class^=EditProfileForm]').submit()

    isTextInsideClass(
      '[class^=EditProfile_TitleTertiary]',
      `${FIRST_NAME_TEXT} ${LAST_NAME_TEXT}`
    )

    isTextInsideClass(
      '[class^=ProfileDropdown_ClickableButton] span',
      `${FIRST_NAME_TEXT[0]}${LAST_NAME_TEXT[0]}`
    )

    isTextInsideClass(
      '[class^=EditProfile_Row] [class^=ProfilePicture] span',
      `${FIRST_NAME_TEXT[0]}${LAST_NAME_TEXT[0]}`
    )
  })
})
