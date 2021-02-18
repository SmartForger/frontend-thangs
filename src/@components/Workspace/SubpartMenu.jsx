import React, { useCallback } from 'react'
import { SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    SubpartMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: '2',

      '& div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    SubpartMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      outline: 'none',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
  }
})

const SubpartMenu = ({ part = {} }) => {
  const c = useStyles({})
  const { setOverlay } = useOverlay()

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      track('Subpart Menu - Edit Part')
      setOverlay({
        isOpen: true,
        template: 'editPart',
        data: {
          part,
          type: 'part',
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [part, setOverlay]
  )

  return (
    <div className={c.SubpartMenu}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Edit</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'1rem'} />
    </div>
  )
}

export default SubpartMenu
