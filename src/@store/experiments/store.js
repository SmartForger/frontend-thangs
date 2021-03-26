import api from '@services/api'
import * as R from 'ramda'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { STATUSES, getStatusState } from '@store/constants'
import { v4 as uuidv4 } from 'uuid'

export default store => {
  store.on(types.STORE_INIT, () => ({
    experiments: {
      data: [],
    },
  }))

  store.on(
    types.CHANGE_EXPERIMENTS_STATUS,
    (state, { status = STATUSES.INIT, data }) => ({
      ...state,
      experiments: {
        ...getStatusState(status),
        data,
      },
    })
  )

  store.on(types.FETCH_EXPERIMENTS, async _state => {
    store.dispatch(types.CHANGE_EXPERIMENTS_STATUS, {
      status: STATUSES.LOADING,
    })
    const currentUserId = authenticationService.getCurrentUserId()
    let savedExpId = authenticationService.getExpIdInLocalStorage()
    if (!currentUserId && !savedExpId) {
      savedExpId = uuidv4()
      authenticationService.setExpIdInLocalStorage(savedExpId)
    }
    const { data, error } = await api({
      method: 'GET',
      endpoint: `experiments/${currentUserId || savedExpId}`,
    })
    if (error || R.isEmpty(data)) {
      store.dispatch(types.CHANGE_EXPERIMENTS_STATUS, {
        status: STATUSES.FAILURE,
      })
    } else {
      const experiments =
        data &&
        data.length &&
        data.reduce((exps, exp) => {
          return { ...exps, [exp.feature]: exp.value }
        }, {})
      store.dispatch(types.CHANGE_EXPERIMENTS_STATUS, {
        status: STATUSES.LOADED,
        data: experiments,
      })
    }
  })
}
