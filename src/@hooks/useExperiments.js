import { useMemo } from 'react'
import { useStoreon } from 'storeon/react'

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
  const value = useExperiments(feature)
  return !value //TODO: Flip before go-live
}
