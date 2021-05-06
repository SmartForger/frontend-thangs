import { lazy } from 'react'

export const AddFolder = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './AddFolder')
)
export const AttachmentUpload = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './AttachmentUpload')
)
export const AttachmentView = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './AttachmentView')
)
export const DeleteAttachment = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './DeleteAttachment')
)
export const DeleteComment = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './DeleteComment')
)
export const DeleteFolder = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './DeleteFolder')
)
export const DeleteModel = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './DeleteModel')
)
export const EditComment = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './EditComment')
)
export const EditFolder = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './EditFolder')
)
export const EditModel = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './EditModel')
)
export const InviteUsers = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './InviteUsers')
)
export const License = lazy(() => import(/* webpackChunkName: 'overlays' */ './License'))
export const MoreInfo = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './MoreInfo')
)
export const MultiUpload = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './MultiUpload')
)
export const PasswordReset = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './PasswordReset')
)
export const Report = lazy(() => import(/* webpackChunkName: 'overlays' */ './Report'))
export const ReportModel = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './ReportModel')
)
export const ReviewVersion = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './ReviewVersion')
)
export const SearchByUpload = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './SearchByUpload')
)
export const SelectPartToVersion = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './SelectPartToVersion')
)
export const Signin = lazy(() => import(/* webpackChunkName: 'overlays' */ './Signin'))
export const Signup = lazy(() => import(/* webpackChunkName: 'overlays' */ './Signup'))
export const VersionPublished = lazy(() =>
  import(/* webpackChunkName: 'overlays' */ './VersionPublished')
)
