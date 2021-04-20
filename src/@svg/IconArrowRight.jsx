import React from 'react'

const noop = () => null

const IconArrowRight = ({ size = 16, color = '#000000', filled = true, className = '', onClick = noop }) => {
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
        fillRule="evenodd" clipRule="evenodd" d="M0.302986 15.7777C-0.0700543 15.4552 -0.103195 14.9002 0.228964 14.538L6.16575 8.06488C6.19967 8.02789 6.19967 7.9721 6.16575 7.93512L0.228964 1.46196C-0.103196 1.09979 -0.070055 0.544769 0.302985 0.22229C0.676026 -0.100189 1.2477 -0.0680142 1.57986 0.294155L7.51665 6.76732C8.16112 7.47001 8.16111 8.52999 7.51665 9.23268L1.57986 15.7058C1.2477 16.068 0.676026 16.1002 0.302986 15.7777Z" fill="black"
        {...fillProps}
      />
    </svg>
  )
}

export default IconArrowRight
