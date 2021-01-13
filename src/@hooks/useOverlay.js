import { useContext, useMemo, useReducer } from 'react'
import {
  AddFolder,
  DeleteFolder,
  DeleteModel,
  DeleteComment,
  EditFolder,
  EditModel,
  InviteUsers,
  MultiUpload,
  PasswordReset,
  ReportModel,
  SearchByUpload,
  Signin,
  Signup,
  Upload,
  EditComment,
  MoreInfo,
} from '@overlays'
import { OverlayContext } from '@components'

const overlayTemplates = {
  addFolder: AddFolder,
  deleteFolder: DeleteFolder,
  deleteModel: DeleteModel,
  editFolder: EditFolder,
  editModel: EditModel,
  inviteUsers: InviteUsers,
  multiUpload: MultiUpload,
  passwordReset: PasswordReset,
  reportModel: ReportModel,
  searchByUpload: SearchByUpload,
  signIn: Signin,
  signUp: Signup,
  moreInfo: MoreInfo,
  upload: Upload,
  editComment: EditComment,
  deleteComment: DeleteComment,
}

const useOverlayProvider = () => {
  const [overlay, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'all':
          return { ...state, ...action.payload }
        case 'open':
          return { ...state, isOpen: action.payload }
        case 'hidden':
          return { ...state, isHidden: action.payload }
        case 'template':
          return { ...state, template: action.payload }
        case 'data':
          return { ...state, data: { ...state.data, ...action.payload } }
        default:
          return state
      }
    },
    { isOpen: false, template: null, data: {} }
  )

  const setOverlay = overlayObj => {
    dispatch({
      type: 'all',
      payload: overlayObj,
    })
  }

  const setOverlayOpen = isOpen => {
    dispatch({
      type: 'open',
      payload: isOpen,
    })
  }

  const setOverlayHidden = isHidden => {
    dispatch({
      type: 'hide',
      payload: isHidden,
    })
  }

  const setOverlayTemplate = template => {
    dispatch({
      type: 'template',
      payload: template,
    })
  }

  const setOverlayData = data => {
    dispatch({
      type: 'data',
      payload: data,
    })
  }

  const toggleOverlayOpen = () => setOverlayOpen(!overlay.isOpen)

  const OverlayComponent = useMemo(() => {
    return (
      (overlay.isOpen && overlay.template && overlayTemplates[overlay.template]) || null
    )
  }, [overlay])
  return {
    setOverlay,
    setOverlayOpen,
    setOverlayHidden,
    setOverlayTemplate,
    setOverlayData,
    toggleOverlayOpen,
    OverlayComponent,
    overlayData: overlay.data,
    isOverlayOpen: overlay.isOpen,
    isOverlayHidden: overlay.isHidden,
  }
}

const useOverlay = () => {
  return useContext(OverlayContext) || {}
}

export { useOverlay, useOverlayProvider }
