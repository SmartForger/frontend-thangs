import React from 'react'
import { StoreContext } from 'storeon/react'
import { createStoreon } from 'storeon'
import AddFolder from './AddFolder'
import EditFolder from './EditFolder'

export default {
  title: 'Organism/CreateEditDialogue',
}

const getStore = (storeObj = {}) =>
  createStoreon([
    store => {
      store.on('@init', () => storeObj)
    },
  ])

const storeObj = {}
const folder = JSON.parse(
  '{"id":"76","name":"Asper","root":null,"description":null,"created":"2020-09-09T16:24:49.373Z","creator":{"id":74,"username":"e.kosenko","firstName":"E00f","lastName":"K00s","fullName":"E00f K00s","isOwner":true,"profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/83ccfc26-9ce1-404d-9517-c988fe957bed?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-and-physna%40appspot.gserviceaccount.com%2F20210204%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210204T105739Z&X-Goog-Expires=901&X-Goog-SignedHeaders=host&X-Goog-Signature=1ee39d6b311e6aaefebf2f47227445d3ddee0997bbaa1969868234d02c5b9d8518beb3ffdcab81841245165e783eb6f8e2bc89894f8b2517410f0cbf96a4544409726cf7cce1563ef0c82003dc67a17f0d7e55f501bae4bf54624563d0a9d547e96cd5307a10f61b5d7f77d174054449f7f27919e82442c962646eb48e0b791e050452a6977be144bf63af009ee7a69e93eb0596f12f5997b427dff2483d0a2c804584ff15038d279647bd3da174b42f1d6c3f997fab03e7d12430ac12d588e2c336a0d621fcff6450f8ed4d5d2126e39866fb949ad0c69ceadb0cb8332a22537615a42f7483aee6ecc0e49dc7c7de285d13bdb44b30fb2e05f242b3e6ac3424"}},"members":[{"id":74,"username":"e.kosenko","firstName":"E00f","lastName":"K00s","fullName":"E00f K00s","isOwner":true,"profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/83ccfc26-9ce1-404d-9517-c988fe957bed?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-and-physna%40appspot.gserviceaccount.com%2F20210204%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210204T105739Z&X-Goog-Expires=901&X-Goog-SignedHeaders=host&X-Goog-Signature=1ee39d6b311e6aaefebf2f47227445d3ddee0997bbaa1969868234d02c5b9d8518beb3ffdcab81841245165e783eb6f8e2bc89894f8b2517410f0cbf96a4544409726cf7cce1563ef0c82003dc67a17f0d7e55f501bae4bf54624563d0a9d547e96cd5307a10f61b5d7f77d174054449f7f27919e82442c962646eb48e0b791e050452a6977be144bf63af009ee7a69e93eb0596f12f5997b427dff2483d0a2c804584ff15038d279647bd3da174b42f1d6c3f997fab03e7d12430ac12d588e2c336a0d621fcff6450f8ed4d5d2126e39866fb949ad0c69ceadb0cb8332a22537615a42f7483aee6ecc0e49dc7c7de285d13bdb44b30fb2e05f242b3e6ac3424"}},{"id":145,"username":"AutoFolder","firstName":"Colin","lastName":"Staging","fullName":"Colin Staging","isOwner":false,"profile":{"avatarUrl":null}},{"id":146,"username":"FolderFix","firstName":"Colin","lastName":"Staging","fullName":"Colin Staging","isOwner":false,"profile":{"avatarUrl":null}}],"models":[{},{},{"id":6633,"name":"belt_holster.stl","parts":[{"name":"belt_holster.stl","size":1176412,"filename":"d5cfad50-7455-4f67-9c0a-70665f626204.stl","isPrimary":true,"phyndexerId":"ce16e866-8aa6-44f5-876c-14e5c18b677a","attachmentId":6658,"originalFileName":"belt_holster.stl"}],"units":"mm","description":"fg","accessTypeId":0,"matchingData":[],"owner":{"id":74,"username":"e.kosenko","firstName":"E00f","lastName":"K00s","fullName":"E00f K00s","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/83ccfc26-9ce1-404d-9517-c988fe957bed?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1612437160&Signature=RnDIkwB5jOphjVeVtnp2NXwNKXupBjZydoTRTx8lb84vYr1tWatU5fP7SAQggnghcqx6Nsfil%2BltsnIUz3TaKp%2FtCJ6AcOOjZ%2B5kmi3lFwjAzNdhkCL1fxxMhQ1UhWQBn9pmWN0QW9W7UJKcZ%2F6e39DOfRUXt%2FurcSUPC4nBY1hWQlFd5uW3%2FbOewtON1dfsJV3XhWNZ6oZa2spICgK2cCOz4QmHY3P2chza8y%2FJZ3H1AANx6F5%2FeRwmB%2FR78jNdDuwBJefHFXTqmNYXe%2BDw9rGl7Ibmru7nUOIH%2By9QaPe3AM1WCsqhyhua96vYw0RdxG74bZIirYJTPKFiAx96bw%3D%3D","description":""},"isBeingFollowedByRequester":false},"created":"2020-12-16T11:42:46.628+00:00","likesCount":0,"downloadCount":0}],"likes":[74],"subfolders":[{"id":"547","name":"Asper//mm","models":[],"root":"76","description":null,"likes":[],"likesCount":0,"isPublic":false}],"pending":[],"likesCount":"1","isPublic":false}'
)

export const CreateFolderTest = () => {
  return (
    <StoreContext.Provider value={getStore(storeObj)}>
      <AddFolder />
    </StoreContext.Provider>
  )
}

export const EditFolderTest = () => {
  return (
    <StoreContext.Provider value={getStore(storeObj)}>
      <EditFolder folder={folder} />
    </StoreContext.Provider>
  )
}
