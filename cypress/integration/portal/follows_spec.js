import {
  goTo,
  isTextInsideClass,
  loginByUser,
} from '../../utils/common-methods'
import { CLASSES, MODEL, PROPS, TEXT, USER, USER2 } from '../../utils/constants'
import { multiUpload } from '../../utils/uploadMethods'
import api, { apiLogin } from '../../utils/api'

describe('User notifications', () => {
  before(() => {
    // BE-reset: Test2 unfollows Test if it needs
    apiLogin({ userName: USER2.EMAIL, password: USER2.PASSWORD })
      .then(() => {
        return api({
          endpoint: `users/${USER.ID}`,
          method: 'GET',
        })
      })

      .then(response => {
        const user = response.body || {}
        const isFollowed = user.isBeingFollowedByRequester

        cy.log('########################### Is followed', isFollowed)
        if (isFollowed) {
          return api({
            endpoint: `users/${USER.ID}/unfollow`,
            method: 'DELETE',
          })
        } else {
          return Promise.resolve('ok')
        }
      })
      .then(response => {
        cy.log(
          '########################### Finish',
          response === 'End' && JSON.stringify(response)
        )
      })

    // BE-reset: Test1 delete all the models
    apiLogin({ userName: USER.EMAIL, password: USER.PASSWORD })
      .then(() => {
        return api({
          endpoint: `users/${USER.ID}/thangs`,
          method: 'GET',
        })
      })

      .then(response => {
        const data = response.body || {}
        const models = data.models || []

        cy.log('########################### User models', models.length)

        const deleteModelRec = async modelsIds => {
          if (modelsIds.length > 0) {
            const modelId = modelsIds.pop()

            await api({
              endpoint: `models/${modelId}`,
              method: 'DELETE',
            })

            cy.log('########################### Model deleted', modelId)

            deleteModelRec(modelsIds)
          }
        }

        deleteModelRec(models.map(model => model.id))
      })
  })

  it('User1 uploads model', () => {
    localStorage.clear()

    loginByUser({
      email: USER.EMAIL,
      password: USER.PASSWORD,
    })
    multiUpload()
  })

  it('User2 follows and unfollows User1 from public portfolio', () => {
    loginByUser({
      email: USER2.EMAIL,
      password: USER2.PASSWORD,
    })
    goTo(`/${USER.NAME}`)

    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.PROFILE_FOLLOW_BUTTON).click()
    isTextInsideClass(CLASSES.PROFILE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.wait(2000)
  })

  it('User2 follows and unfollows User1 from model', () => {
    loginByUser({
      email: USER2.EMAIL,
      password: USER2.PASSWORD,
    })
    goTo(`/${USER.NAME}`)

    cy.get(`[title="${MODEL.TITLE}"] [class^=ModelCard_Thumbnail]`, {
      timeout: 20000,
    }).click()

    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.MODEL_PAGE_FOLLOW_BUTTON).first().click()
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    cy.get(CLASSES.MODEL_PAGE_FOLLOW_BUTTON).first().click()
    isTextInsideClass(CLASSES.MODEL_PAGE_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
  })
})
