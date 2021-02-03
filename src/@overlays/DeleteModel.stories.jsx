import React from 'react'
import { StoreContext } from 'storeon/react'
import { createStoreon } from 'storeon'
import { createUseStyles } from '@style'
import DeleteModel from './DeleteModel'

export default {
  title: 'Organism/ConfirmDialogue',
}

const useStyles = createUseStyles(_theme => {
  return {
    Container: {
      '& > *': {
        margin: '3rem',
      },
    },
  }
})

const getStore = (storeObj = {}) =>
  createStoreon([
    store => {
      store.on('@init', () => storeObj)
    },
  ])

const storeObj = {
  'model-id': { isSaving: false },
  folderNav: {},
}

const model = JSON.parse('{"id":"2101","name":"9991","parts":[{"name":"9991","size":609684,"filename":"d69ad731-f3c4-43a6-8785-279c7740e763.stl","isPrimary":true,"phyndexerId":"bc5574e2-92ac-4d8d-9469-b8f017f56d17","attachmentId":2030,"originalFileName":"horn1.stl"}],"units":"mm","description":"df","accessTypeId":0,"matchingData":[],"owner":{"id":74,"username":"e.kosenko","firstName":"E00f","lastName":"K00s","fullName":"E00f K00s","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/83ccfc26-9ce1-404d-9517-c988fe957bed?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1612355048&Signature=Qtl2WaMj6zRB%2BsyKXxSwOJzHey%2BmRz%2BIzENeQZX3lTa9g4ksxF4dhpZgmXBfuqjSU5kNTomYgoTX4qBOrCaEqwWWBh4IpzjoZWuqP6i5RR62HXfXxy9nFfahQ24pLLOIxuwAUxvVktRc9GK8XmeN4Ob%2B6F3ZLaOg2JZFGnE2Mmx5aAUD2CrDfnkG9hDHeFN6qkmCOdH1WUdSswy1ScBzmWAli14UDbnc9TN%2FO8Ygc787OcoQf8w2yUOEKnP5qiuCt%2FRkcSsFOhWH6w2%2B6xzvawlbENblkFff6d7Ray1wb4Cz6OjjMHK17CVJAiWanmsB9%2Fwm%2FzUx4vjJlVoeu9XtYA%3D%3D","description":""},"isBeingFollowedByRequester":false},"created":"2020-09-29T10:47:36.870Z","likesCount":0,"commentsCount":0,"downloadCount":1,"identifier":"ekosenko/9991-2101","matchingPhyndexerId":null}')

export const DeleteModelTest = () => {
  const c = useStyles({})

  return (
    <StoreContext.Provider value={getStore(storeObj)}>
      <DeleteModel model={model} type={'model'} />
    </StoreContext.Provider>
  )
}
