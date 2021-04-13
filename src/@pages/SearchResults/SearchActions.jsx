import React, { useCallback, useMemo } from 'react'
import { useLocalStorage, useOverlay } from '@hooks'

const noop = () => null

const SearchActionContext = React.createContext({
  isAuthedUser: false,
  reportModel: noop,
  findRelated: noop,
  openSignup: noop,
})

const SearchActionProvider = ({ children }) => {
  const [currentUser] = useLocalStorage('currentUser', null)
  const isAuthedUser = useMemo(() => !!currentUser, [currentUser])

  const { setOverlay, setOverlayOpen } = useOverlay()

  const handleReportModel = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'reportModel',
        data: {
          model: model,
          afterSend: () => {
            setOverlayOpen(false)
          },
        },
      })
    },
    [setOverlay, setOverlayOpen]
  )

  const handleFindRelated = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'searchByUpload',
        data: {
          model,
        },
      })
    },
    [setOverlay]
  )

  const handleOpenSignup = useCallback(
    (titleMessage, source) => {
      setOverlay({
        isOpen: true,
        template: 'signUp',
        data: {
          animateIn: true,
          windowed: true,
          titleMessage,
          smallWidth: true,
          source,
        },
      })
    },
    [setOverlay]
  )

  const availableActions = useMemo(
    () => ({
      isAuthedUser,
      reportModel: handleReportModel,
      findRelated: handleFindRelated,
      openSignup: handleOpenSignup,
    }),
    [isAuthedUser, handleReportModel, handleFindRelated, handleOpenSignup]
  )

  return (
    <SearchActionContext.Provider value={availableActions}>
      {children}
    </SearchActionContext.Provider>
  )
}

export { SearchActionContext, SearchActionProvider }
