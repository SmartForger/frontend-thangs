import api from '@services/api'
import { getStatusState, STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const SEARCH_RESULT_SIZE = 50

const noop = () => null
const getInitialState = () => ({
  ...getStatusState(STATUSES.INIT),
  data: [],
  pageToLoad: 0,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    textSearchResults: getInitialState(),
  }))

  store.on(types.CHANGE_TEXT_SEARCH_RESULTS_STATUS, (state, { status, isInitial }) => ({
    textSearchResults: {
      ...state.textSearchResults,
      ...getStatusState(status),
      ...(isInitial && { data: [], pageToLoad: 1 }),
    },
  }))

  store.on(types.RESET_TEXT_SEARCH_RESULTS, () => ({
    textSearchResults: getInitialState(),
  }))

  store.on(types.LOADED_TEXT_SEARCH_RESULTS, (state, { data, isInitial }) => ({
    textSearchResults: {
      ...state.textSearchResults,
      ...getStatusState(STATUSES.LOADED),
      data: isInitial ? data : [...state.textSearchResults.data, ...data],
      pageToLoad: isInitial
        ? 1
        : state.textSearchResults.pageToLoad +
          Math.floor(data.length / SEARCH_RESULT_SIZE),
    },
  }))

  store.on(
    types.FETCH_TEXT_SEARCH_RESULTS,
    async (
      state,
      {
        isInitial = false,
        onError = noop,
        onFinish = noop,
        pageCount = 1,
        scope,
        searchTerm,
      }
    ) => {
      if (!state.textSearchResults.isLoading) {
        store.dispatch(types.CHANGE_TEXT_SEARCH_RESULTS_STATUS, {
          status: STATUSES.LOADING,
          isInitial,
        })
        const { data = [], error } = await api({
          method: 'GET',
          endpoint: 'models/search-by-text',
          params: {
            searchTerm,
            collapse: true,
            scope: scope || 'all',
            page: isInitial ? 0 : state.textSearchResults.pageToLoad,
            pageSize:
              isInitial && pageCount === 1
                ? SEARCH_RESULT_SIZE
                : SEARCH_RESULT_SIZE * pageCount,
          },
        })

        track('Text Search Started', {
          searchTerm,
          searchScope: scope,
          pageCount: isInitial ? 0 : state.textSearchResults.pageToLoad,
        })

        if (error) {
          store.dispatch(types.CHANGE_TEXT_SEARCH_RESULTS_STATUS, {
            status: STATUSES.FAILURE,
          })
          onError(error)
        } else {
          store.dispatch(types.CHANGE_TEXT_SEARCH_RESULTS_STATUS, {
            status: STATUSES.LOADED,
          })
          store.dispatch(types.LOADED_TEXT_SEARCH_RESULTS, {
            data,
            isInitial,
          })

          track(`Text search - ${data.length > 0 ? 'Results' : 'No Results'}`, {
            searchTerm,
            searchScope: scope,
            numOfMatches: data.length,
          })

          onFinish({
            data,
            endOfData: !data.length || data.length < SEARCH_RESULT_SIZE,
          })
        }
      }
    }
  )
}
