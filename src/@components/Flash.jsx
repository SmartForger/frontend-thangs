import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Flash: {
      ...theme.text.flashToastText,
      backgroundColor: theme.variables.colors.flashColor,
      borderRadius: '.5rem',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
    },
  }
})

const Flash = ({ children, _props }) => {
  const c = useStyles()
  return <div className={c.Flash}>{children}</div>
}

const FlashContext = React.createContext([null, {}])

const FlashContextProvider = props => {
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

const WithFlash = ({ children }) => {
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

const useFlashNotification = () => {
  const [, { setFlash, navigateWithFlash }] = useContext(FlashContext)
  return { setFlash, navigateWithFlash }
}

export { Flash, FlashContextProvider, WithFlash, useFlashNotification }
