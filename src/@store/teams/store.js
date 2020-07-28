import postTeams, { getTeam, getTeams } from '../../@services/store-service/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isSaving: false,
  isSaved: false,
  saveError: false,
  currentTeam: null,
})

export default store => {
  store.on('@init', () => ({
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
    const teams = await getTeams()
    store.dispatch('update-teams', teams)
  })

  store.on('fetch-team', async (state, id) => {
    const team = await getTeam(id)
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

  store.on('add-team', async (state, data) => {
    store.dispatch('saving-team')
    const res = await postTeams(data)
    if (res.status === 201) {
      store.dispatch('team-saved')
      setTimeout(() => store.dispatch('fetch-teams'), 1000)
    } else {
      store.dispatch('team-saved-error')
    }
  })
}
