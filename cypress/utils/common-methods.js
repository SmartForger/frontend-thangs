import * as R from 'ramda'
import {
  CLASSES,
  DATA_CY,
  MODEL_TEST_TITLE,
  PATH,
  PROPS,
  TEXT,
  MODEL,
  USER,
  USER2,
} from './constants'
import {
  clearInput,
  enterValidValue,
  findInput,
  modelDescriptionInput,
  modelTitleInput,
  inputSelectors,
} from './inputs'
import api, { apiLogin } from './api'

export const isElement = (el, prop) => {
  cy.get(el, { timeout: 5000 }).should(prop)
}

export const isElementContains = (element, text) => {
  cy.get(element, { timeout: 5000 }).contains(text).should(PROPS.VISIBLE)
}

export const isElementNotEmptyAndValid = (el, prop, value) => {
  cy.get(el, { timeout: 5000 }).should(prop).and('match', value)
}

export const clickOnElementByText = text => {
  cy.contains(text, { timeout: 7000 }).click({ force: true })
}

export const rightClickOnElement = el => {
  cy.get(el, { timeout: 10000 }).rightclick()
}

export const clickOnElement = el => {
  cy.get(el, { timeout: 60000 }).click({ force: true, multiple: true })
}

export const goTo = path => {
  cy.visit(path, { timeout: 30000 })
}

export const isTextExist = text => {
  cy.contains(text)
}

export const urlShouldInclude = path => {
  cy.url().should('include', path)
}

export const isElementContainTwoValues = (el, value1, value2) =>
  cy.get(el, { timeout: 15000 }).should(PROPS.CONTAIN, value1).and(PROPS.CONTAIN, value2)

export const urlShouldIncludeAfterTimeout = (path, timeout) => {
  cy.url({ timeout: timeout }).should('include', path)
}

export const getGeneratedUser = uuid => {
  return {
    EMAIL: `cypress-test-${uuid}@test.com`,
    PASSWORD: 'test',
    NAME: `cypress-test-${uuid}`,
  }
}

export const login = user => {
  goTo('/')
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
  enterValidValue(CLASSES.LOGIN_FORM, user.emailInput)
  enterValidValue(CLASSES.LOGIN_FORM, user.passwordInput)
  clickOnElement(CLASSES.LOGIN_BUTTON)
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
}

export const loginByUser = ({ email, password }) => {
  goTo('/')
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  clickOnElementByText(TEXT.LOG_IN)
  isElement(CLASSES.LOGIN_FORM, PROPS.VISIBLE)
  cy.get(`[class^=Signin_Form] ${inputSelectors.email}`)
    .focus()
    .type(email, { force: true })
  cy.get(`[class^=Signin_Form] ${inputSelectors.password}`)
    .focus()
    .type(password, { force: true })
  clickOnElement(CLASSES.LOGIN_BUTTON)
  isElement(CLASSES.LOGIN_FORM, PROPS.INVISIBLE)
  isElement(CLASSES.USER_NAVBAR, PROPS.VISIBLE)
}

export const openNotifications = () => {
  isElement(CLASSES.NOTIFICATIONS_BUTTON, PROPS.VISIBLE) &&
    isElement(CLASSES.NOTIFICATIONS_DROPDOWN, PROPS.INVISIBLE)
  clickOnElement(CLASSES.NOTIFICATIONS_BUTTON)
  isElement(CLASSES.NOTIFICATIONS_DROPDOWN, PROPS.VISIBLE)
}

export const openProfileDropdown = () => {
  isElement(CLASSES.PROFILE_BUTTON, PROPS.VISIBLE) &&
    isElement(CLASSES.PROFILE_DROPDOWN, PROPS.INVISIBLE)
  clickOnElement(CLASSES.PROFILE_BUTTON)
  isElement(CLASSES.PROFILE_DROPDOWN, PROPS.VISIBLE)
}

export const openMyThangs = () => {
  openProfileDropdown()
  clickOnElementByText(TEXT.VIEW_MY_THANGS)
  isElement(CLASSES.MY_THANGS_NAVBAR, PROPS.VISIBLE)
  isElement(CLASSES.MY_THANGS_RECENT_FILES, PROPS.VISIBLE)
}

export const openMultiUpload = () => {
  clickOnElementByText(TEXT.UPLOAD)
  isElement(DATA_CY.MULTI_UPLOAD_OVERLAY, PROPS.VISIBLE)
}

export const uploadFile = (filename, input) => {
  cy.fixture(filename, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(fileContent => {
      cy.get(input.selector).attachFile({
        fileContent,
        filePath: filename,
        encoding: 'utf-8',
      })
    })
}

export const editAndSaveFile = () => {
  clearInput(CLASSES.UPLOAD_FORM, modelTitleInput)
  enterValidValue(CLASSES.UPLOAD_FORM, modelTitleInput)
  enterValidValue(CLASSES.UPLOAD_FORM, modelDescriptionInput)
  clickOnTextInsideClass(CLASSES.UPLOAD_BUTTON_GROUP, 'Save Model')
}

export const fillAndSubmitMultiuploadForm = () => {
  isElement(DATA_CY.MULTIUPLOAD_FORM, PROPS.VISIBLE)
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=name]`).clear()
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=name]`).focus().type(MODEL.FILENAME)
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=description]`).clear()
  cy.get(`${DATA_CY.MULTIUPLOAD_FORM} [name=description]`).focus().type(MODEL.DESCRIPTION)
  clickOnTextInsideClass(CLASSES.BUTTON, 'Continue')
}

export const deleteModel = () => {
  goTo(PATH.PROFILE)
  clickOnElement(CLASSES.MODEL_CARD_EDIT_BUTTON)
  clickOnElementByText(TEXT.DELETE_MODEL)
  clickOnElementByText(TEXT.CONFIRM)
  isElement(MODEL_TEST_TITLE, PROPS.INVISIBLE)
}

export const deleteSingleFile = () => {
  goTo(PATH.MY_THANGS)
  rightClickOnElement(CLASSES.MY_THANGS_MENU_BUTTON)
  clickOnElementByText(TEXT.REMOVE)
  isTextInsideClass(CLASSES.MY_THANGS_DELETE_FORM_BUTTON, TEXT.DELETE)
  clickOnTextInsideClass(CLASSES.MY_THANGS_DELETE_FORM_BUTTON, TEXT.DELETE)
  isElement(CLASSES.MY_THANGS_NO_FILES, PROPS.VISIBLE)
}

export const deleteAllFiles = async () => {
  let elements = null
  goTo(PATH.MY_THANGS)
  cy.wait(7000)
  cy.get('body', { timeout: 10000 }).then($body => {
    if ($body.find(CLASSES.MY_THANGS_MENU_BUTTON).length > 0) {
      cy.get(CLASSES.MY_THANGS_MENU_BUTTON).then($el => {
        elements = Cypress.$($el).length
        if (elements > 0) {
          for (let i = 0; i < elements; i++) {
            cy.get(CLASSES.MY_THANGS_MENU_BUTTON)
              .first()
              .rightclick()
              .each(() => {
                clickOnElementByText(TEXT.REMOVE)
                isTextInsideClass(CLASSES.MY_THANGS_DELETE_FORM_BUTTON, TEXT.DELETE)
                clickOnTextInsideClass(CLASSES.MY_THANGS_DELETE_FORM_BUTTON, TEXT.DELETE)
                isElement(CLASSES.MY_THANGS_DELETE_FORM_BUTTON, PROPS.INVISIBLE)
              })
          }
        }
      })
    }
    isElement(CLASSES.MY_THANGS_NO_FILES, PROPS.VISIBLE)
  })
}

export const signOut = () => {
  openProfileDropdown()
  clickOnElementByText(TEXT.SIGN_OUT)
  isElement(CLASSES.PROFILE_DROPDOWN, PROPS.INVISIBLE)
}

export const findElement = (className, element, index = 0) => {
  return cy.get(className).then(el => {
    return new Cypress.Promise(resolve => {
      if (el.find(element)) {
        resolve(el.find(element).eq(index))
      } else {
        resolve(cy.get(el).find(element))
      }
    })
  })
}

export const clickOnElementInsideClass = (className, el) => {
  return findInput(className, el).click({ force: true, multiple: true })
}

export const clickOnTextInsideClass = (className, text) => {
  cy.get(className, { timeout: 10000 })
    .contains(text, { timeout: 10000 })
    .click({ force: true, multiple: true })
}

export const isTextInsideClass = (className, text, prop) => {
  prop
    ? cy.get(className, { timeout: 20000 }).contains(text).should(prop)
    : cy.get(className, { timeout: 20000 }).contains(text)
}

export const registerUser = userKey => {
  const uuid = `${new Date().valueOf()}`
  const user = getGeneratedUser(uuid)
  const { EMAIL: email, PASSWORD: password, NAME: username } = user

  api({
    endpoint: 'users',
    method: 'POST',
    body: {
      email,
      password,
      firstName: '',
      lastName: '',
      username,
      registrationCode: 'alpha',
    },
  }).then(z => {
    const newUserIdJSON = R.pathOr({}, ['allRequestResponses', 0, 'Response Body'], z)
    const newUserId = JSON.parse(newUserIdJSON).id
    const userWithId = { ID: newUserId, ...user }

    log('Registered user:', JSON.stringify(userWithId))
    cy.setCookie(userKey, JSON.stringify(userWithId))
    window[userKey] = userWithId
  })
}

export const clearModelsAndFolders = (user = USER) => {
  if (localStorage.getItem('currentUser')) {
    localStorage.removeItem('currentUser')
  }
  return apiLogin({ userName: user.EMAIL, password: user.PASSWORD })
    .then(() => {
      return api({
        endpoint: `users/${user.ID}/thangs`,
        method: 'GET',
      })
    })

    .then(response => {
      const data = response.body || {}
      const models = data.models || []
      const folders = data.folders || []

      log('User models', models.length)

      const deleteModelRec = async modelsIds => {
        if (modelsIds.length > 0) {
          const modelId = modelsIds.pop()

          await api({
            endpoint: `models/${modelId}`,
            method: 'DELETE',
          })

          log('Model deleted', modelId)

          deleteModelRec(modelsIds)
        }
      }

      log('User folders', folders.length)

      const deleteFolderRec = async foldersIds => {
        if (foldersIds.length > 0) {
          const folderId = foldersIds.pop()

          await api({
            endpoint: `folders/${folderId}`,
            method: 'DELETE',
          })

          log('Folder deleted', folderId)

          deleteFolderRec(foldersIds)
        }
      }

      deleteModelRec(models.map(model => model.id))
      deleteFolderRec(folders.map(folder => folder.id))
      localStorage.removeItem('currentUser')

      return Promise.resolve('ok')
    })
}

//User A unfollows user B if it needs
export const unfollowUser = (userA = USER, userB = USER2) =>
  apiLogin({ userName: userA.EMAIL, password: userA.PASSWORD })
    .then(() => {
      return api({
        endpoint: `users/${userB.ID}`,
        method: 'GET',
      })
    })

    .then(response => {
      const isFollowed = (response.body || {}).isBeingFollowedByRequester

      if (isFollowed) {
        log(userA.NAME, 'is followed', userB.NAME)
        log('unfollow initiated')

        return api({
          endpoint: `users/${userB.ID}/unfollow`,
          method: 'DELETE',
        })
      } else {
        log(userA.NAME, 'is NOT followed', userB.NAME)
        return Promise.resolve('ok')
      }
    })
    .then(response => {
      localStorage.removeItem('currentUser')
      log('Finished', response === 'End' && JSON.stringify(response))

      return Promise.resolve('ok')
    })

//User A follows user B
export const followUser = (userA = USER, userB = USER2) =>
  apiLogin({ userName: userA.EMAIL, password: userA.PASSWORD })
    .then(() => {
      return api({
        endpoint: `users/${userB.ID}`,
        method: 'GET',
      })
    })

    .then(response => {
      const isFollowed = (response.body || {}).isBeingFollowedByRequester

      if (!isFollowed) {
        log('follow initiated')

        return api({
          endpoint: `users/${userB.ID}/follow`,
          method: 'POST',
        })
      } else {
        return Promise.resolve('ok')
      }
    })
    .then(response => {
      localStorage.removeItem('currentUser')
      log('Finished', response === 'End' && JSON.stringify(response))

      return Promise.resolve('ok')
    })

export const log = (...args) => {
  cy.log(`⏩⏩⏩⏩⏩⏩⏩⏩  ${args.join(' ')}`)
}
