import React from 'react'
import { StoreContext } from 'storeon/react'
import { createStoreon } from 'storeon'
import { MemoryRouter } from 'react-router'
import Header from './'

export default {
  title: 'Organism/Header',
  decorators: [story => <MemoryRouter>{story()}</MemoryRouter>],
}

const currentUser = JSON.parse(
  '{"id":"74","username":"e.kosenko","firstName":"E00f","lastName":"K00s","fullName":"E00f K00s","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/83ccfc26-9ce1-404d-9517-c988fe957bed?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1612197835&Signature=m%2BuRIOSHsIG77ukL3UJG55siRUv05OWFiGnRGWSJpOtO5amfS8a6OWpd4oVKMW6x5HXL4czEBpzqhtxErJqqZMqhFBp4zFjfW8OtnSG5zY7jLalVpZ2j4vuywKRdYSqSr08UmX6NeMLV5APogDDiSTyZPuJsWV9NWURVRXXb9upPpC%2BkhF0vHYIb5ApRCUPt1wc52%2FGlIBsMoJr3qfMLSAyv3gcEavysPM7xXZjW4RL0fnzxQZxsIzL71fe%2FW70LWPZuDhnAYoQjtpQLe7gMcaJ3SKGyE5Vd9Kba39AHsSPcv8xY7muw5XEfpNr0%2BQer5aGY7vBRxQZvEtUEOpaPmg%3D%3D","description":"lkjlkljfu dfg"},"likes":[7585,7482,7326,7511,7320,7510,76,7327,7546,7328,6632,7289,564,7279,48,49,148,44,119,178,77,297,71,1201,1083,7214,31,30,45,144,263,301,267,1726,436,348,368,535,1613,456,647,2083,2097,1256,435,3938,3965,2092,4581,1981,2882,1585,3943,2103,1871,1983,906,4544,4602,1720,2094,1831,2086,4537,4536,3830,1728,4532,3690,4548,2029,4605,5042,4657,1978,1721,1727,5750,649,3909,1706,5748,3918,903,7283],"isBeingFollowedByRequester":false}'
)

const getStore = (storeObj = {}) =>
  createStoreon([
    store => {
      store.on('@init', () => storeObj)
    },
  ])

const unauthStoreObj = {
  currentUser: {},
}

const authStoreObj = {
  currentUser: {
    isLoaded: true,
    isLoading: false,
    isError: false,
    data: currentUser,
  },
  notifications: {
    isLoaded: true,
    isLoading: false,
    isError: false,
    data: { notifications: []},
  }
}

export const DesktopHeaderUnauth = () => {
  return (
    <StoreContext.Provider value={getStore(unauthStoreObj)}>
      <Header
        showSearchTextFlash={true}
        showSearch={true}
        showUser={true}
        showNewHero={false}
        showAboutHero={false}
      />
    </StoreContext.Provider>
  )
}

export const DesktopHeaderAuth = () => {
  return (
    <StoreContext.Provider value={getStore(authStoreObj)}>
      <Header
        showSearchTextFlash={true}
        showSearch={true}
        showUser={true}
        showNewHero={false}
        showAboutHero={false}
      />
    </StoreContext.Provider>
  )
}