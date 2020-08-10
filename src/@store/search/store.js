import api from '@services/api'

const noop = () => null
const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on('@init', () => ({
    searchResults: getInitAtom(),
  }))

  store.on('update-search-results', (state, { data }) => ({
    searchResults: {
      ...state.results,
      data,
    },
  }))
  store.on('loading-search-results', state => ({
    searchResults: {
      ...state.results,
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on('loaded-search-results', (state, { data }) => ({
    searchResults: {
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on(
    'get-search-results',
    async (state, { searchTerm, onFinish = noop, onError = noop }) => {
      store.dispatch('loading-search-results')
      api({
        method: 'GET',
        endpoint: `models/search-by-text?searchTerm=${searchTerm}`,
      })
        .then(res => {
          if (res.status === 200) {
            store.dispatch('loaded-search-results', res)
            onFinish(res)
          }
        })
        .catch(error => {
          onError(error)
        })
    }
  )
}
