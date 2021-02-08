import {
  clearModelsAndFolders,
  goTo,
  isTextInsideClass,
  loginByUser,
  unfollowUser,
} from '../utils/common-methods'
import { CLASSES, MODEL_CARD, PROPS, TEXT, USER3, USER4 } from '../utils/constants'
import { multiUpload } from '../utils/uploadMethods'

const ACTION_USER1 = USER3
const SUPPORT_USER2 = USER4

describe('User notifications', () => {
  before(() => {
    unfollowUser(SUPPORT_USER2, ACTION_USER1)
    clearModelsAndFolders(ACTION_USER1)
  })

  it('User1 uploads model', () => {
    localStorage.clear()

    loginByUser({
      email: ACTION_USER1.EMAIL,
      password: ACTION_USER1.PASSWORD,
    })
    multiUpload()
  })

  it('User2 follows and unfollows User1 from public portfolio', () => {
    loginByUser({
      email: SUPPORT_USER2.EMAIL,
      password: SUPPORT_USER2.PASSWORD,
    })
    goTo(`/${ACTION_USER1.NAME}`)

    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.wait(2000)
  })

  it('User2 follows and unfollows User1 from model', () => {
    loginByUser({
      email: SUPPORT_USER2.EMAIL,
      password: SUPPORT_USER2.PASSWORD,
    })
    goTo(`/${ACTION_USER1.NAME}`)
    cy.wait(3000)
    cy.get(MODEL_CARD()).click()

    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.MODEL_PAGE_FOLLOW_BUTTON).first().click()
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.MODEL_PAGE_FOLLOW_BUTTON).first().click()
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
  })
})
