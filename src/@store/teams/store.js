import postTeams, { getTeams } from '../../@services/store-service/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isSaving: false,
  isSaved: false,
  saveError: false,
})

export default store => {
  store.on('@init', () => ({
    teams: getInitAtom(),
  }))

  store.on('update-teams', (state, event) => ({
    teams: {
      ...state,
      isLoaded: true,
      isLoading: true,
      data: event,
    },
  }))

  store.on('fetch-teams', async _state => {
    const teams = await getTeams()
    store.dispatch('update-teams', teams)
  })

  store.on('saving-team', state => ({
    teams: {
      ...state,
      isSaving: true,
      isSaved: false,
    },
  }))

  store.on('team-saved', state => ({
    teams: {
      ...state,
      isSaving: false,
      isSaved: true,
    },
  }))

  store.on('team-save-error', state => ({
    teams: {
      ...state,
      saveError: true,
    },
  }))

  store.on('add-team', async (state, data) => {
    store.dispatch('saving-team')
    const res = await postTeams(data)
    if (res.status === 201) {
      store.dispatch('team-saved')
      store.dispatch('fetch-teams')
    } else {
      store.dispatch('team-saved-error')
    }
  })
}
