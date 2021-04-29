import { useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import useLocalStorage from './useLocalStorage'

export const useExperiments = feature => {
  const { experiments } = useStoreon('experiments')
  return useMemo(() => {
    if (experiments?.data) {
      return experiments?.data[feature] || null
    }

    return null
  }, [experiments, feature])
}

export const useIsFeatureOn = feature => {
  const [storedValue] = useLocalStorage(feature)
  const value = useExperiments(feature)
  return typeof storedValue !== 'undefined' ? storedValue : !value // TODO: Flip before go-live
}
