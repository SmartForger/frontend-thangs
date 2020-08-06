import useCommonStoreon from './useCommonStoreon'
import useFetchOnce from './useFetchOnce'
import useFetchPerMount from './useFetchPerMount'

const useServices = () => {
  return {
    useCommonStoreon,
    useFetchOnce,
    useFetchPerMount,
  }
}

export default useServices
