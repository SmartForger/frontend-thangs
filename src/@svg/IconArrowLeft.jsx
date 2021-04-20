import React from 'react'

const noop = () => null

const IconArrowLeft = ({ size = 16, color = '#000000', filled = true, className = '', onClick = noop }) => {
  const fillProps = filled
    ? {
      fill: color,
    }
    : {
      stroke: color,
    }

  return (
    <svg className={className} onClick={onClick} width={size / 2} height={size} viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd" clipRule="evenodd" d="M7.69701 0.222292C8.07005 0.544771 8.10319 1.09979 7.77104 1.46196L1.83425 7.93512C1.80033 7.97211 1.80033 8.02789 1.83425 8.06488L7.77104 14.538C8.10319 14.9002 8.07005 15.4552 7.69701 15.7777C7.32397 16.1002 6.7523 16.068 6.42014 15.7058L0.483348 9.23268C-0.161118 8.52999 -0.161115 7.47001 0.48335 6.76732L6.42014 0.294156C6.7523 -0.0680128 7.32397 -0.100188 7.69701 0.222292Z" fill="black"
        {...fillProps}
      />
    </svg>

  )
}

export default IconArrowLeft
