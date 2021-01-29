import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

// const buildGeoRatioURL = (startURL, data) => {
//   const dataQuery = Object.keys(data).reduce((acc, curVal) => {
//     let newAcc = ''
//     if (data[curVal]) {
//       if (!acc.includes('?')) newAcc = '?'
//       newAcc += `${curVal}=${data[curVal]}&`
//     }
//     return acc + newAcc
//   }, '')
//   return startURL + dataQuery
// }

export default store => {
  store.on(types.STORE_INIT, () => ({}))

  store.on(types.INIT_RELATED_MODELS, (_, { id }) => ({
    [`related-models-${id}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_RELATED_MODELS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      ...state,
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.FETCH_RELATED_MODELS, async (_, { id }) => {
    store.dispatch(types.CHANGE_RELATED_MODELS, {
      status: STATUSES.LOADING,
      atom: `related-models-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/match/${id}`,
    })

    if (error) {
      store.dispatch(types.CHANGE_RELATED_MODELS, {
        status: STATUSES.FAILURE,
        atom: `related-models-${id}`,
      })
    } else {
      if (data && Array.isArray(data)) {
        const results = {}
        data.forEach(result => {
          const { status, matches } = result
          // numOfMatches += searchData && searchData.matches && searchData.matches.length
          if (status === 'completed') {
            results.matches.push(matches)
          }
        })
        store.dispatch(types.CHANGE_RELATED_MODELS, {
          status: STATUSES.LOADED,
          atom: `related-models-${id}`,
          data: results,
        })
      }
    }
  })
}
