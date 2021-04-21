import { useContext, useMemo, useReducer } from 'react'
import {
  AddFolder,
  AttachmentUpload,
  AttachmentView,
  DeleteComment,
  DeleteFolder,
  DeleteModel,
  DeleteAttachment,
  EditComment,
  EditFolder,
  EditModel,
  InviteUsers,
  License,
  MoreInfo,
  MultiUpload,
  PasswordReset,
  Report,
  ReportModel,
  ReviewVersion,
  SearchByUpload,
  SelectVersionModel,
  Signin,
  Signup,
  VersionPublished,
} from '@overlays'
import { OverlayContext } from '@components'

const overlayTemplates = {
  addFolder: AddFolder,
  attachmentUpload: AttachmentUpload,
  attachmentView: AttachmentView,
  deleteComment: DeleteComment,
  deleteFolder: DeleteFolder,
  deleteModel: DeleteModel,
  deleteAttachment: DeleteAttachment,
  editComment: EditComment,
  editFolder: EditFolder,
  editModel: EditModel,
  inviteUsers: InviteUsers,
  license: License,
  moreInfo: MoreInfo,
  multiUpload: MultiUpload,
  passwordReset: PasswordReset,
  report: Report,
  reportModel: ReportModel,
  reviewVersion: ReviewVersion,
  searchByUpload: SearchByUpload,
  selectVersionModel: SelectVersionModel,
  signIn: Signin,
  signUp: Signup,
  versionPublished: VersionPublished,
}

const useOverlayProvider = () => {
  const [overlay, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'all':
          return { ...action.payload }
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
