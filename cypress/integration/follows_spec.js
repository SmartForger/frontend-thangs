import {
  clearModelsAndFolders,
  clickOnTextInsideClass,
  goTo,
  isTextInsideClass,
  loginByUser,
  unfollowUser,
} from '../utils/common-methods'
import { CLASSES, MODEL, PROPS, TEXT } from '../utils/constants'
import { multiUpload } from '../utils/uploadMethods'

describe('User follows', () => {
  let activeUser
  let sideUser

  before(() => {
    cy.getCookie('activeUser').then(({ value }) => {
      activeUser = JSON.parse(value)
    })
    cy.getCookie('sideUser').then(({ value }) => {
      sideUser = JSON.parse(value)

      unfollowUser(sideUser, activeUser)
    })
  })

  it('User1 uploads model', () => {
    localStorage.clear()

    loginByUser({
      email: activeUser.EMAIL,
      password: activeUser.PASSWORD,
    })
    multiUpload()
  })

  it('User2 follows and unfollows User1 from public portfolio', () => {
    loginByUser({
      email: sideUser.EMAIL,
      password: sideUser.PASSWORD,
    })
    goTo(`/${activeUser.NAME}`)

    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
  })

  it('User2 follows and unfollows User1 from model', () => {
    loginByUser({
      email: sideUser.EMAIL,
      password: sideUser.PASSWORD,
    })
    goTo(`/${activeUser.NAME}`)

    clickOnTextInsideClass(CLASSES.MODEL_CARD, MODEL.TITLE)

    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.MODEL_PAGE_FOLLOW_BUTTON).first().click()
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.MODEL_PAGE_FOLLOW_BUTTON).first().click()
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
  })
})
