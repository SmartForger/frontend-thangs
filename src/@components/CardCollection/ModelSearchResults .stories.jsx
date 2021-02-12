import React from 'react'
import { createUseStyles } from '@style'
import ModelSearchResults from './ModelSearchResults'

const items = JSON.parse(
  `[
    {
       "modelId":"82d014c8-bfcb-4dfe-bf8c-65f19ad4d375",
       "fileName":"sites/b2b.partcommunity.com/models/airplane-193804/Airplane.obj",
       "source":"web-data-extraction-uploads",
       "scope":"phyndexer",
       "modelFileName":"Airplane.obj",
       "modelTitle":"Airplane",
       "modelDescription":"Airplane Model Made of Wood",
       "modelCategory":"Vehicles & Transportation",
       "attributionUrl":"https://b2b.partcommunity.com/community/partcloud/index?model_id=68569",
       "thumbnailUrl":"https://development-thangs-thumbs-dot-thangs.uc.r.appspot.com/convert/sites%2Fb2b.partcommunity.com%2Fmodels%2Fairplane-193804%2FAirplane.obj?source=web-data-extraction-uploads",
       "resultSource":"phyndexer"
    },
    {
       "modelId":"fcbb2a4c-b701-4e65-8055-fcbe8f386d72",
       "fileName":"sites/3delicious.net/models/airplane-187175/Airplane FW3FL N160712.3DS",
       "source":"web-data-extraction-uploads",
       "scope":"phyndexer",
       "modelFileName":"Airplane FW3FL N160712.3DS",
       "modelTitle":"Airplane",
       "modelDescription":"Airplane FW3FL N160712 - 3D exterior 3d visualization.",
       "modelCategory":"Aircraft & Space",
       "attributionUrl":"https://3delicious.net/index.php?a=detail&id=51056",
       "thumbnailUrl":"https://development-thangs-thumbs-dot-thangs.uc.r.appspot.com/convert/sites%2F3delicious.net%2Fmodels%2Fairplane-187175%2FAirplane%20FW3FL%20N160712.3DS?source=web-data-extraction-uploads",
       "resultSource":"phyndexer"
    },
    {
       "modelId":"15e13177-8304-41d0-82f2-25e6214ef6cc",
       "fileName":"sites/3delicious.net/models/airplane-124349/aeroplan_toy.3DS",
       "source":"web-data-extraction-uploads",
       "scope":"phyndexer",
       "modelFileName":"aeroplan_toy.3DS",
       "modelTitle":"Airplane",
       "modelDescription":"Airplane Toy - 3D model for interior 3d visualization.",
       "modelCategory":"Toys & Children Room",
       "attributionUrl":"https://3delicious.net/index.php?a=detail&id=1526",
       "thumbnailUrl":"https://development-thangs-thumbs-dot-thangs.uc.r.appspot.com/convert/sites%2F3delicious.net%2Fmodels%2Fairplane-124349%2Faeroplan_toy.3DS?source=web-data-extraction-uploads",
       "resultSource":"phyndexer"
    }
 ]`
)

const useStyles = createUseStyles(_theme => {
  return {
    Container: {
      margin: '1rem',
    },
  }
})
export const ModelSearchResultsTest = () => {
  const c = useStyles()

  return (
    <div className={c.Container}>
      <ModelSearchResults items={items} />
    </div>
  )
}

export default {
  title: 'Molecules/SearchResult',
}
