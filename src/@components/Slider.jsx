import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { default as MuiSlider } from '@material-ui/core/Slider'

const CustomSlider = withStyles({
  root: {
    width: 200,
    color: '#242424',
    height: 4,
    padding: '13px 0',
  },
  thumb: {
    height: 24,
    width: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -11,
    marginLeft: -12,
    '&:hover': {
      boxShadow: 'none',
    },
    '& .bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {
    boxShadow: '0px 0px 5px 5px rgba(36, 36, 36, 0.16)',
  },
  focusVisible: {
    boxShadow: '0px 0px 5px 5px rgba(36, 36, 36, 0.16) !important',
  },
  track: {
    height: 3,
  },
  rail: {
    color: '#999',
    opacity: 1,
    height: 3,
  },
})(MuiSlider)

function CustomThumbComponent(props) {
  return (
    <span {...props}>
      <span className='bar' />
      <span className='bar' />
      <span className='bar' />
    </span>
  )
}

const Slider = props => {
  return <CustomSlider ThumbComponent={CustomThumbComponent} {...props} />
}

export default Slider
