export const STATUSES = {
  INIT: 'INIT',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  FAILURE: 'FAILURE',
}

export const getStatusState = status => {
  if (status === STATUSES.LOADING) {
    return {
      isLoaded: false,
      isLoading: true,
      isError: false,
    }
  }
  if (status === STATUSES.LOADED) {
    return {
      isLoaded: true,
      isLoading: false,
      isError: false,
    }
  }
  if (status === STATUSES.SAVING) {
    return {
      isSaved: false,
      isSaving: true,
      isError: false,
    }
  }
  if (status === STATUSES.SAVED) {
    return {
      isSaved: true,
      isSaving: false,
      isError: false,
    }
  }
  if (status === STATUSES.FAILURE) {
    return {
      isLoaded: true,
      isLoading: false,
      isError: true,
    }
  }

  return {
    isLoaded: false,
    isLoading: false,
    isError: false,
  }
}
