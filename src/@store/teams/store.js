import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

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

  store.on('update-teams', (state, event) => ({
    teams: {
      ...state.teams,
      isLoaded: true,
      isLoading: false,
      isSaved: false,
      data: event,
    },
  }))

  store.on('update-team', (state, event) => ({
    teams: {
      ...state.teams,
      isLoaded: true,
      isLoading: false,
      currentTeam: event,
    },
  }))

  store.on('fetch-teams', async _state => {
    const { data: teams } = await api({
      method: 'GET',
      endpoint: 'teams',
    })
    store.dispatch('update-teams', teams)
  })

  store.on('fetch-team', async (state, id) => {
    const { data: team } = await api({
      method: 'GET',
      endpoint: `teams/${id}`,
    })
    store.dispatch('update-team', team)
  })

  store.on('saving-team', state => ({
    teams: {
      ...state.teams,
      isSaving: true,
      isSaved: false,
    },
  }))

  store.on('team-saved', state => ({
    teams: {
      ...state.teams,
      isSaving: false,
      isSaved: true,
    },
  }))

  store.on('team-save-error', state => ({
    teams: {
      ...state.teams,
      saveError: true,
    },
  }))

  store.on('add-team', async (state, { data, onFinish, onError }) => {
    store.dispatch('saving-team')
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
      store.dispatch('fetch-teams')
      store.dispatch('team-saved')
      pendo.track('Team Created')
      onFinish()
    } catch (error) {
      store.dispatch('team-save-error')
      onError(error)
    }
  })
}
