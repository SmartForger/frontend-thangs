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
        width: '13.5rem',
        lineHeight: '1rem',
      },
    },
    NavLink_Arrow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        transition: 'transform 150ms ease-in-out',
      },
    },
    NavLink_Arrow__expanded: {
      transform: 'rotate(90deg)',
    },
    NavLink_Link: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '2px 0',
      cursor: 'pointer',
    },
  }
})

const noop = () => null

const LinkContents = ({
  Icon,
  c,
  handleArrowClick = noop,
  handleLinkClick = noop,
  isExpanded,
  isFolder,
  label,
}) => {
  const onLinkClick = useCallback(() => {
    handleArrowClick()
    handleLinkClick()
  }, [handleArrowClick, handleLinkClick])

  return (
    <>
      {isFolder && (
        <div className={c.NavLink_Arrow} onClick={handleArrowClick}>
          <ArrowRightIcon
            className={classnames({ [c.NavLink_Arrow__expanded]: isExpanded })}
          />
          <Spacer size={'.75rem'} />
        </div>
      )}
      <div className={c.NavLink_Link} onClick={onLinkClick}>
        <Icon />
        <Spacer size={'.75rem'} />
        <SingleLineBodyText>{label}</SingleLineBodyText>
      </div>
    </>
  )
}

const NavLink = ({ Icon, className, folderId, isFolder, label, onClick = noop, to }) => {
  const c = useStyles({})
  const { dispatch, folderNav } = useStoreon('folderNav')

  const isExpanded = useMemo(() => folderNav[folderId], [folderId, folderNav])

  const handleArrowClick = useCallback(() => {
    if (isExpanded) {
      dispatch(types.FOLDER_CLOSE, { id: folderId })
    } else {
      dispatch(types.FOLDER_OPEN, { id: folderId })
    }
  }, [dispatch, folderId, isExpanded])

  return to ? (
    <Link className={classnames(className, c.NavLink)} to={to} title={label}>
      <LinkContents
        Icon={Icon}
        c={c}
        handleArrowClick={handleArrowClick}
        handleLinkClick={onClick}
        isExpanded={isExpanded}
        isFolder={isFolder}
        label={label}
      />
    </Link>
  ) : (
    <div className={classnames(className, c.NavLink)} title={label}>
      <LinkContents
        Icon={Icon}
        c={c}
        handleArrowClick={handleArrowClick}
        handleLinkClick={onClick}
        isExpanded={isExpanded}
        isFolder={isFolder}
        label={label}
      />
    </div>
  )
}

export default NavLink
