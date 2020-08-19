import { useCallback, useState } from 'react'

import { logger } from '@utilities/logging'

//crc: a hook to store data in local storage
const useLocalStorage = (key, initialValue) => {
  //State to store the value
  //Pass the initial state function
  const [storedValue, setStoredValue] = useState(() => {
    try {
      //Grab local storage by our key
      const item = window.localStorage.getItem(key)
      //Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      logger.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useStates setter function that persist the new value to local storage
  const setValue = useCallback(
    value => {
      try {
        // Allow value to be a function so it is consistent with useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        // Save our state
        setStoredValue(valueToStore)
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        // A more advanced implementation would handle the error case
        logger.log(error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key)
  }, [key])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
