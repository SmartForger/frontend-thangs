import { useState, useEffect } from 'react'
import api from '@services/api'
import { logger } from '@utilities/logging'

const useUserName = userName => {
  const [userId, setUserId] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userName) {
          setUserId(undefined)
          return setLoading(false)
        }
        const { data } = await api({
          method: 'GET',
          endpoint: `users/portfolio/${userName}`,
        })
        setUserId(data && data.userId)
        setLoading(false)
      } catch (e) {
        logger.error('Could not get user id', e)

        setError(e)
      }
    }
    fetchData()
  }, [userName])

  return [userId, loading, error]
}

export default useUserName
