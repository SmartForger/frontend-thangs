import React from 'react'
import { StoreContext } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui'
import { createStoreon } from 'storeon'
import CardCollectionRelated from './CardCollectionRelated'
import ModelCardRelated from '@components/ModelCard/ModelCardRelated'

export default {
  title: 'Organism/RelatedResults',
}

const useStyles = createUseStyles(_theme => {
  return {
    CardCollectionContainer: {
      maxWidth: '40rem',
      /*
      '@media (min-width: 320px)': {
        maxWidth: '164px',
        maxHeight: '280px',
      },
      '@media (min-width: 414px)': {
        maxWidth: '221px',
        maxHeight: '308px',
      },
      '@media (min-width: 840px)': {
        maxWidth: '340px',
        maxHeight: '428px',
      },
      */
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
}

const model = JSON.parse(
  '{"id":"7215","name":"X-Wing.stl","parts":[{"name":"X-Wing.stl","size":883684,"filename":"46f4469d-ddda-4469-ae2a-a7b129546a90/X-Wing.stl","folderId":"","isPrimary":true,"description":"fg","phyndexerId":"e47e31db-06dc-4961-b241-28bd431a2d47","attachmentId":8268,"originalFileName":"X-Wing.stl"}],"units":"mm","folderId":"","isAssembly":false,"description":"fg","accessTypeId":0,"matchingData":[],"owner":{"id":74,"username":"e.kosenko","firstName":"E00f","lastName":"K00s","fullName":"E00f K00s","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/83ccfc26-9ce1-404d-9517-c988fe957bed?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1612361335&Signature=eD%2B1V7jh9Gm6oUlzheWj2fk9Mlg1v43Z4hMsKPLsQrU2x%2Fx34fsQ5Eqm%2Bmdv2GAIAFlBgblDnMS3REaS%2BMvYMDSCWHjOTan4Q1D%2BTWDypH5YglHhtwKNy83iBRC1XgRt8uKCQnS7caXgDBc2OLRtYlsaKHcnyEZmVnQ%2FR9obg2%2B803l9uQ7Hb4yqAW7xpfMkxBak4Pftrft3AThxS06rx59CVq2J0%2FsYJuNWG3rA0wSoydq8Y8wvXE3KZIq%2FhPHjtvb3Ql1OUdKr3zMM6rvCY0tMl%2Fl11ANL%2F2v3CYoCt1%2BTHSlYertRArQChtVharpPCjPuTacLHGYe98Vn3StU8w%3D%3D","description":""},"isBeingFollowedByRequester":false},"created":"2021-01-22T11:35:43.395Z","likesCount":0,"commentsCount":0,"downloadCount":0,"identifier":"ekosenko/XWingstl-7215","matchingPhyndexerId":null}'
)

export const ModelCardTest = () => {
  const c = useStyles({})

  return (
    <StoreContext.Provider value={getStore(storeObj)}>
      <div className={c.CardCollectionContainer}>
        <CardCollectionRelated
          maxPerRow={3}
          noResultsText='No geometrically related matches yet.'
        >
          {[1, 2, 3, 4].map(item => (
            <ModelCardRelated key={`model-${item}`} model={model} geoRelated={true} />
          ))}
        </CardCollectionRelated>
      </div>
    </StoreContext.Provider>
  )
}
