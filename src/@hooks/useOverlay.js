import React, { useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import {
  AddFolder,
  DeleteFolder,
  DeleteModel,
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
} from '@overlays'
import { Overlay } from '@components'

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
  upload: Upload,
}

const useOverlay = () => {
  const { overlay } = useStoreon('overlay')
  const OverlayComponent = useMemo(() => {
    const OverlayView =
      overlay && overlay.isOpen && overlayTemplates[overlay.currentOverlay]

    return OverlayView ? (
      <Overlay
        isOpen={overlay.isOpen}
        isHidden={overlay.isHidden}
        {...overlay.overlayData}
      >
        <OverlayView {...overlay.overlayData} />
      </Overlay>
    ) : null
  }, [overlay])

  return {
    Overlay: OverlayComponent,
    isOverlayOpen: overlay.isOpen,
    isOverlayHidden: overlay.isHidden,
  }
}

export default useOverlay
