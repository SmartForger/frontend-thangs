import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import {
  CreateFolder,
  CreateTeam,
  EditModel,
  FolderManagement,
  PasswordReset,
  ReportModel,
  SearchByUpload,
  Signin,
  Signup,
  Upload,
} from '@overlays'
import { Overlay } from '@components'

const overlayTemplates = {
  createFolder: CreateFolder,
  createTeam: CreateTeam,
  editModel: EditModel,
  folderManagement: FolderManagement,
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
