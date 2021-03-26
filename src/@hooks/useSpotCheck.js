import { useCallback, useRef } from 'react'
import * as R from 'ramda'

const useSpotCheck = (key, conditions = {}) => {
  const spotCheckRef = useRef(null)
  let spotCheck = null
  const { spotId, ...data } = JSON.parse(sessionStorage.getItem(key)) || {}
  sessionStorage.removeItem(key)
  if (R.equals(data, conditions)) {
    spotCheck = spotId
  }

  const setSpotCheck = useCallback(
    (spotId, conditions) => {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          spotId,
          ...conditions,
        })
      )
    },
    [key]
  )

  return {
    setSpotCheck,
    spotCheck,
    spotCheckRef,
  }
}

export default useSpotCheck
