import {
  clickOnElement,
  clickOnTextInsideClass,
  editAndSaveFile,
  goTo,
  isElement,
  isTextInsideClass,
  login,
  login2,
  openUpload,
  openMultiUpload,
  uploadFile,
  signOut,
  isElementContains,
  fillMultiuploadForm,
  loginByUser,
} from '../../../utils/common-methods'
import {
  CLASSES,
  DATA_CY,
  MODEL,
  PROPS,
  TEXT,
  USER,
  USER2,
} from '../../../utils/constants'
import { commentInput, enterValidValue } from '../../../utils/inputs' 
import { multiUpload, deleteModel } from '../../../utils/uploadMethods'

describe('User notifications', () => {
  it('User1 uploads model', () => {
    loginByUser({
      email: USER.EMAIL, 
      password: USER.PASSWORD,
    })
    multiUpload()
  })

  it('User1 beign followed by User2', () => {
    loginByUser({
      email: USER2.EMAIL, 
      password: USER2.PASSWORD,
    })
    goTo('/test')
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
    clickOnElement(CLASSES.USER_FOLLOW_BUTTON)
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
  })

  it('User2 likes and comments User1 model', () => {
    loginByUser({
      email: USER2.EMAIL, 
      password: USER2.PASSWORD,
    })
    goTo('/test')
    clickOnElement(`[title="${MODEL.TITLE}"]`)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKE, PROPS.VISIBLE)
    clickOnElement(CLASSES.MODEL_PAGE_LIKE_BUTTON)
    isTextInsideClass(CLASSES.MODEL_PAGE_LIKE_BUTTON, TEXT.LIKED, PROPS.VISIBLE)

    enterValidValue(CLASSES.MODEL_ADD_COMMENT_FORM, commentInput)
    clickOnTextInsideClass(CLASSES.MODEL_ADD_COMMENT_FORM, TEXT.COMMENT)
    isTextInsideClass(CLASSES.MODEL_COMMENT_FORM, MODEL.COMMENT, PROPS.VISIBLE)
  })
  
  it('Unfollow', () => {
    loginByUser({
      email: USER2.EMAIL, 
      password: USER2.PASSWORD,
    })
    goTo('/test')
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.UNFOLLOW, PROPS.VISIBLE)
    clickOnElement(CLASSES.USER_FOLLOW_BUTTON)
    isTextInsideClass(CLASSES.USER_FOLLOW_BUTTON, TEXT.FOLLOW, PROPS.VISIBLE)
  })

  it('Delete', () => {
    loginByUser({
      email: USER.EMAIL, 
      password: USER.PASSWORD,
    })
    deleteModel(MODEL.TITLE)
  })
})
