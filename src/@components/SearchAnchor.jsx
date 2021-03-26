import React, { useCallback } from 'react'
import { track } from '@utilities/analytics'
import { Link } from 'react-router-dom'

const noop = () => null
const SearchAnchor = ({
  children,
  to = {},
  isExternal,
  scope,
  searchIndex,
  onThangsClick = noop,
  ...props
}) => {
  const onClick = useCallback(() => {
    if (isExternal) {
      track('External Model Link', {
        path: to.pathname,
        type: 'text',
        scope,
        searchIndex,
      })
    } else {
      onThangsClick(searchIndex)
      track('Thangs Model Link', {
        path: to.pathname,
        query: to.search ?? null,
        type: 'text',
        scope,
        searchIndex,
      })
    }
  }, [isExternal, onThangsClick, scope, searchIndex, to.pathname, to.search])
  if (!to.pathname) return children
  let thangsPath = !isExternal ? to.pathname.split('.com').pop() : to.pathname

  if (to.search) {
    thangsPath += to.search
  }

  return isExternal ? (
    <a
      href={encodeURI(thangsPath)}
      target='_blank'
      rel='noopener noreferrer'
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  ) : (
    <Link to={encodeURI(thangsPath)} onClick={onClick} {...props}>
      {children}
    </Link>
  )
}

export default SearchAnchor
