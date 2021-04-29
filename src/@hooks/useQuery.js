import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useQuery = query => {
  const location = useLocation()
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ])
  const result = useMemo(() => searchParams.get(query), [searchParams, query])
  return result
}

export default useQuery
