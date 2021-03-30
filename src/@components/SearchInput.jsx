import React, { useCallback } from 'react'
import classnames from 'classnames'
import { Spacer, TextInput } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'

const useStyles = createUseStyles(theme => {
  return {
    SearchInput: {
      background: theme.colors.white[600],
      borderRadius: '.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      width: '100%',

      '& input': {
        background: theme.colors.white[600],
        border: 'none',
        color: theme.colors.black[900],
        fontSize: '1rem',
        lineHeight: '1.5rem',
        outline: 'none',
        padding: 0,
        width: '100%',

        '&::placeholder': {
          color: theme.colors.black[900],
          fontSize: '.875rem',
          fontWeight: 500,
          lineHeight: '1rem',
        },

        '&:focus, &:active': {
          background: theme.colors.white[600],
          color: theme.colors.grey[300],
          '&::placeholder': {
            color: 'transparent',
          },
        },
      },
    },
    SearchInput_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
    SearchInput_Icon: {
      flex: 'none',
    },
  }
})

const noop = () => null

const SearchInput = ({ className, onChange = noop }) => {
  const c = useStyles()

  const handleInputChange = useCallback(
    val => {
      onChange(val)
    },
    [onChange]
  )

  return (
    <div className={classnames(className, c.SearchInput)}>
      <Spacer size={'.5rem'} />
      <div className={c.SearchInput_Row}>
        <Spacer size={'1rem'} />
        <SearchIcon className={c.SearchInput_Icon} />
        <Spacer size={'.5rem'} />
        <TextInput
          name='search'
          placeholder={'Filter models by name'}
          onChange={e => {
            handleInputChange(e.target.value)
          }}
          autoComplete='off'
        />
      </div>
      <Spacer size={'.5rem'} />
    </div>
  )
}

export default SearchInput
