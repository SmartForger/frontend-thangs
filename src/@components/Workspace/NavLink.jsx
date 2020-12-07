import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Spacer, SingleLineBodyText } from '@components'
import { ReactComponent as ArrowRightIcon } from '@svg/icon-arrow-right-sm.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(_theme => {
  return {
    NavLink: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      paddingLeft: '.125rem',

      '& span': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: ({ level }) => `${13.5 - level * 2}rem`,
        lineHeight: '1rem',
      },
    },
    NavLink_Arrow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 1,

      '& svg': {
        transition: 'transform 150ms ease-in-out',
      },
    },
    NavLink_Arrow__expanded: {
      transform: 'rotate(90deg)',
    },
    NavLink_Arrow__disabled: {
      visibility: 'hidden',
    },
    NavLink_Link: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '2px 0',
      cursor: 'pointer',
      zIndex: 1,
    },
    NavLink__selected: {
      width: '18.5rem',
      height: '2.5rem',
      background: '#E2E2E7',
      position: 'absolute',
      zIndex: 0,
      left: 0,
      borderRadius: '.5rem',
    },
  }
})

const noop = () => null

const LinkContents = ({
  Icon,
  c,
  onArrowClick = noop,
  onLinkClick = noop,
  isExpanded,
  isFolder,
  label,
  isIconDisabled,
}) => {
  const handleLinkClick = useCallback(() => {
    onArrowClick(true)
    onLinkClick()
  }, [onLinkClick, onArrowClick])

  const handleArrowClick = useCallback(() => {
    onArrowClick()
  }, [onArrowClick])

  return (
    <>
      {isFolder && (
        <div
          className={classnames(c.NavLink_Arrow, {
            [c.NavLink_Arrow__disabled]: isIconDisabled,
          })}
          onClick={handleArrowClick}
        >
          <ArrowRightIcon
            className={classnames({ [c.NavLink_Arrow__expanded]: isExpanded })}
          />
          <Spacer size={'.75rem'} />
        </div>
      )}
      <div className={c.NavLink_Link} onClick={handleLinkClick}>
        <Icon />
        <Spacer size={'.75rem'} />
        <SingleLineBodyText>{label}</SingleLineBodyText>
      </div>
    </>
  )
}

const NavLink = ({
  Icon,
  className,
  folderId,
  isFolder,
  label,
  onClick = noop,
  to,
  selected = false,
  level = 0,
  isIconDisabled,
}) => {
  const c = useStyles({ level })
  const { dispatch, folderNav } = useStoreon('folderNav')

  const isExpanded = useMemo(() => folderNav[folderId], [folderId, folderNav])

  const handleArrowClick = useCallback(
    (onlyExpand = false) => {
      if (isExpanded) {
        if (!onlyExpand) dispatch(types.FOLDER_CLOSE, { id: folderId })
      } else {
        dispatch(types.FOLDER_OPEN, { id: folderId })
      }
    },
    [dispatch, folderId, isExpanded]
  )

  return to ? (
    <Link className={classnames(className, c.NavLink)} to={to} title={label}>
      {selected && <div className={c.NavLink__selected}></div>}
      <LinkContents
        Icon={Icon}
        c={c}
        onArrowClick={handleArrowClick}
        onLinkClick={onClick}
        isExpanded={isExpanded}
        isFolder={isFolder}
        label={label}
        isIconDisabled={isIconDisabled}
      />
    </Link>
  ) : (
    <div className={classnames(className, c.NavLink)} title={label}>
      {selected && <div className={c.NavLink__selected}></div>}
      <LinkContents
        Icon={Icon}
        c={c}
        onArrowClick={handleArrowClick}
        onLinkClick={onClick}
        isExpanded={isExpanded}
        isFolder={isFolder}
        isIconDisabled={isIconDisabled}
        label={label}
      />
    </div>
  )
}

export default NavLink
