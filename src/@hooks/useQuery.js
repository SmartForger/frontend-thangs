import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useQuery = query => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  return useMemo(() => searchParams.get(query), [searchParams, query])
}

export default useQuery
