import { useState, useEffect } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { logger } from '../logging'

const useStl = url => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url, {
          headers: {
            Origin: window.location.origin,
            'Content-Type': 'application/octet-stream',
          },
        })
        const blob = await response.blob()
        const data = await blob.arrayBuffer()

        const loader = new STLLoader()
        const geometry = loader.parse(data)
        setData(geometry)
        setLoading(false)
      } catch (e) {
        logger.error('Could not load model data', e)

        setError(e)
      }
    }
    fetchData()
  }, [url])

  return [data, loading, error]
}

export default useStl
