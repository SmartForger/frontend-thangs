import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isSaving: false,
  isSaved: false,
  saveError: false,
  currentTeam: null,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    teams: getInitAtom(),
  }))

  store.on(types.UPDATE_TEAMS, (state, event) => ({
    teams: {
      ...state.teams,
      isLoaded: true,
      isLoading: false,
      isSaved: false,
      data: event,
    },
  }))

  store.on(types.UPDATE_TEAM, (state, event) => ({
    teams: {
      ...state.teams,
      isLoaded: true,
      isLoading: false,
      currentTeam: event,
    },
  }))

  store.on(types.FETCH_TEAMS, async _state => {
    const { data: teams } = await api({
      method: 'GET',
      endpoint: 'teams',
    })
    store.dispatch(types.UPDATE_TEAMS, teams)
  })

  store.on(types.FETCH_TEAM, async (state, id) => {
    const { data: team } = await api({
      method: 'GET',
      endpoint: `teams/${id}`,
    })
    store.dispatch(types.UPDATE_TEAM, team)
  })

  store.on(types.SAVING_TEAM, state => ({
    teams: {
      ...state.teams,
      isSaving: true,
      isSaved: false,
    },
  }))

  store.on(types.SAVED_TEAM, state => ({
    teams: {
      ...state.teams,
      isSaving: false,
      isSaved: true,
    },
  }))

  store.on(types.ERROR_SAVING_TEAM, state => ({
    teams: {
      ...state.teams,
      saveError: true,
    },
  }))

  store.on(types.ADD_TEAM, async (state, { data, onFinish, onError }) => {
    store.dispatch(types.SAVING_TEAM)
    try {
      const { teamName, teamMembers } = data
      await api({
        method: 'POST',
        endpoint: 'teams',
        body: {
          name: teamName,
          members: teamMembers,
        },
      })
      store.dispatch(types.FETCH_TEAMS)
      store.dispatch(types.SAVED_TEAM)
      track('Team Created')
      onFinish()
    } catch (error) {
      store.dispatch(types.ERROR_SAVING_TEAM)
      onError(error)
    }
  })
}
