import useFetchOnce from './useFetchOnce'
import useFetchPerMount from './useFetchPerMount'

const useServices = () => {
  return {
    useFetchOnce,
    useFetchPerMount,
  }
}

export default useServices
