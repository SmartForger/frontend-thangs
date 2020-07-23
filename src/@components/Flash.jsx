import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { flashToastText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Flash: {
      ...flashToastText,
      backgroundColor: theme.colors.flashColor,
      borderRadius: '.5rem',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
    },
  }
})

export const Flash = _props => {
  const c = useStyles()
  return <div className={c.Flash} />
}

const FlashContext = React.createContext([null, {}])

export const FlashContextProvider = props => {
  const history = useHistory()
  const [flash, setFlash] = useState()
  const navigateWithFlash = (to, msg) => {
    history.push(to)
    setTimeout(() => setFlash(msg), 0)
  }

  return (
    <FlashContext.Provider value={[flash, { setFlash, navigateWithFlash }]}>
      {props.children}
    </FlashContext.Provider>
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function WithFlash({ children }) {
  const [flash, { setFlash }] = useContext(FlashContext)
  const c = useStyles()

  useEffect(() => {
    async function clearFlash() {
      await sleep(5000)
      setFlash()
    }
    clearFlash()

    return function cleanup() {
      setFlash()
    }
  }, [setFlash])

  return (
    <>
      {flash && <div className={c.Flash}>{flash}</div>}
      {children}
    </>
  )
}

export function useFlashNotification() {
  const [, { setFlash, navigateWithFlash }] = useContext(FlashContext)
  return { setFlash, navigateWithFlash }
}
