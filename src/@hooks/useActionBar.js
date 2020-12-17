import React, { useEffect, useMemo, useRef } from 'react'
import { useStoreon } from 'storeon/react'
import {} from '@components'
import { ActionBar } from '@components'

const useActionBar = () => {
  const { actionBar = {} } = useStoreon('actionBar')
  const ActionBarComponent = useMemo(() => {
    const ActionBarView = actionBar.isOpen && actionBar.Component
    return ActionBarView ? (
      <ActionBar
        isOpen={actionBar.isOpen}
        isHidden={actionBar.isHidden}
        {...actionBar.data}
      >
        <ActionBarView {...actionBar.data} />
      </ActionBar>
    ) : null
  }, [actionBar])

  return {
    ActionBar: ActionBarComponent,
    isActionBarOpen: actionBar.isOpen,
    isActionBarHidden: actionBar.isHidden,
  }
}

export default useActionBar
