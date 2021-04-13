import api from '@services/api'
import { getStatusState, STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const SEARCH_RESULT_SIZE = 50
const EXACT_MODE_REGEX = /^"([^"]+)"$/

const noop = () => null
const getInitialState = () => ({
  ...getStatusState(STATUSES.INIT),
  data: [],
  pageToLoad: 0,
  endOfData: false,
  isExactSearchMode: false,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    textSearchResults: getInitialState(),
  }))

  store.on(
    types.CHANGE_TEXT_SEARCH_RESULTS_STATUS,
    (state, { status, isInitial, isExactSearchMode = false }) => ({
      textSearchResults: {
        ...state.textSearchResults,
        ...getStatusState(status),
        ...(isInitial && { data: [] }),
        isExactSearchMode,
      },
    })
  )

  store.on(types.RESET_TEXT_SEARCH_RESULTS, () => ({
    textSearchResults: getInitialState(),
  }))

  store.on(
    types.LOADED_TEXT_SEARCH_RESULTS,
    (state, { data, isInitial, isExactSearchMode }) => ({
      textSearchResults: {
        ...state.textSearchResults,
        ...getStatusState(STATUSES.LOADED),
        data: isInitial ? data : [...state.textSearchResults.data, ...data],
        pageToLoad: isInitial ? 1 : state.textSearchResults.pageToLoad + 1,
        endOfData: !data.length,
        isExactSearchMode,
      },
    })
  )

  store.on(
    types.FETCH_TEXT_SEARCH_RESULTS,
    async (
      state,
      { isInitial = false, onError = noop, onFinish = noop, scope, searchTerm }
    ) => {
      if (state.textSearchResults.isLoading) return
      if (isInitial) store.dispatch(types.RESET_TEXT_SEARCH_RESULTS)

      const shouldUseExactMode = EXACT_MODE_REGEX.test(searchTerm)
      const searchQuery = shouldUseExactMode
        ? searchTerm.match(EXACT_MODE_REGEX)[0]
        : searchTerm

      store.dispatch(types.CHANGE_TEXT_SEARCH_RESULTS_STATUS, {
        status: STATUSES.LOADING,
        isInitial,
        isExactSearchMode: shouldUseExactMode,
      })

      const { data = [], error } = await api({
        method: 'GET',
        endpoint: 'models/search-by-text',
        params: {
          searchTerm: searchQuery,
          narrow: shouldUseExactMode ?? 'false',
          collapse: true,
          scope: scope || 'all',
          page: isInitial ? 0 : state.textSearchResults.pageToLoad,
          pageSize: SEARCH_RESULT_SIZE,
        },
      })

      if (isInitial) {
        track('Text Search Started', {
          searchTerm: searchQuery,
          narrow: shouldUseExactMode ?? 'false',
          searchScope: scope,
          pageCount: isInitial ? 0 : state?.textSearchResults?.pageToLoad,
        })
      } else {
        track('Text Search - Infinite Scroll', {
          searchTerm: searchQuery,
          narrow: shouldUseExactMode ?? 'false',
          searchScope: scope,
          pageCount: state?.textSearchResults?.pageToLoad,
        })
      }

      if (error) {
        store.dispatch(types.CHANGE_TEXT_SEARCH_RESULTS_STATUS, {
          status: STATUSES.FAILURE,
        })
        onError(error)
      } else {
        store.dispatch(types.LOADED_TEXT_SEARCH_RESULTS, {
          data,
          isInitial,
          isExactSearchMode: shouldUseExactMode,
        })

        track(`Text search - ${data.length > 0 ? 'Results' : 'No Results'}`, {
          searchTerm: searchQuery,
          narrow: shouldUseExactMode ?? 'false',
          searchScope: scope,
          numOfMatches: data.length,
        })

        onFinish({
          data,
          endOfData: !data.length,
          isExactSearchMode: shouldUseExactMode,
        })
      }
    }
  )
}
