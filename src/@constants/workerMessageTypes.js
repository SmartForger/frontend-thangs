const API_PREFIX = 'api:'
const LOG_PREFIX = 'log:'
const UPLOAD_PREFIX = 'upload:'
const UPLOAD_ATTACHMENTS_PREFIX = 'uploadAttachments:'

export const LOG_INFO = `${LOG_PREFIX}info`
export const LOG_WARN = `${LOG_PREFIX}warn`
export const LOG_ERROR = `${LOG_PREFIX}error`
export const LOG_ERROR_WITH_TRACE_DATA = `${LOG_PREFIX}errorWithTraceData`

export const API_SET_BASE_URL = `${API_PREFIX}setBaseUrl`
export const API_SET_TOKEN = `${API_PREFIX}setToken`
export const API_403 = `${API_PREFIX}403`

export const UPLOAD_UPLOAD = `${UPLOAD_PREFIX}upload`
export const UPLOAD_URLS = `${UPLOAD_PREFIX}urls`
export const UPLOAD_SUCCESS = `${UPLOAD_PREFIX}success`
export const UPLOAD_ERROR = `${UPLOAD_PREFIX}error`
export const UPLOAD_CANCEL = `${UPLOAD_PREFIX}cancel`
export const UPLOAD_CANCELLED = `${UPLOAD_PREFIX}cancelled`

export const UPLOAD_ATTACHMENTS_UPLOAD = `${UPLOAD_ATTACHMENTS_PREFIX}upload`
export const UPLOAD_ATTACHMENTS_URLS = `${UPLOAD_ATTACHMENTS_PREFIX}urls`
export const UPLOAD_ATTACHMENTS_SUCCESS = `${UPLOAD_ATTACHMENTS_PREFIX}success`
export const UPLOAD_ATTACHMENTS_ERROR = `${UPLOAD_ATTACHMENTS_PREFIX}error`
