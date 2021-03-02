import {
  goTo,
  isTextInsideClass,
  loginByUser,
} from '../utils/common-methods'

const FIRST_NAME_TEXT = 'FirstTestName'
const LAST_NAME_TEXT = 'LastTestName'
const DESCRIPTION_TEXT = 'Bio Here'

describe('Profile', () => {
  let activeUser

  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
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
