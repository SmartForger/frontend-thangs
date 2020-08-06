import useCommonStoreon from './useCommonStoreon'
import useFetchOnce from './useFetchOnce'
import useFetchPerMount from './useFetchPerMount'

const useModels = () => {
  return {
    useCommonStoreon,
    useFetchOnce,
    useFetchPerMount,
  }
}

export default useModels
