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
  const liveFeatures = {
    community_uploads_feature: true,
    mythangs_model_page_feature: false,
    new_versions_feature: true,
  }
  const [storedValue] = useLocalStorage(feature)
  const value = liveFeatures[feature] || false
  return typeof storedValue !== 'undefined' ? storedValue : value
}
