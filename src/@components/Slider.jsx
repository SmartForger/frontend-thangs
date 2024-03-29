import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { default as MuiSlider } from '@material-ui/core/Slider'
import { Spacer } from '@components'

const CustomSlider = withStyles({
  root: {
    width: '5.25rem',
    color: '#242424',
    height: '.25rem',
    padding: '13px 8px 7px 8px',
    marginBottom: 0,

    '@media (min-width: 1000px)': {
      width: '7.25rem',
    },

    '@media (min-width: 842px)': {
      padding: '13px 8px',
    },
  },
  thumb: {
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    borderRadius: '.5rem',
    display: 'flex',
    flexDirection: 'row',
    height: '1.5rem',
    justifyContent: 'center',
    marginLeft: -24,
    marginTop: -11,
    transform: 'translateX(.75rem)',
    width: '1.5rem',

    '&:hover': {
      boxShadow: 'none',
    },
    '& .bar': {
      backgroundColor: 'currentColor',
      borderRadius: 2,
      height: 10,
      width: 2,
    },
  },
  active: {
    boxShadow: '0px 0px 5px 5px rgba(36, 36, 36, 0.16)',
  },
  focusVisible: {
    boxShadow: 'none',
  },
  track: {
    borderRadius: 4,
    height: 4,
    left: 0,
  },
  rail: {
    borderRadius: 4,
    height: 4,
    left: 0,
  },
})(MuiSlider)

function CustomThumbComponent(props) {
  return (
    <span {...props}>
      <Spacer size={'5px'} />
      <span className='bar' />
      <Spacer size={'2px'} />
      <span className='bar' />
      <Spacer size={'2px'} />
      <span className='bar' />
      <Spacer size={'5px'} />
    </span>
  )
}

const Slider = props => {
  return <CustomSlider ThumbComponent={CustomThumbComponent} {...props} />
}

export default Slider
