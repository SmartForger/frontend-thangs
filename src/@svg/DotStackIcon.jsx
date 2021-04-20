import React from 'react'

const DotStackIcon = ({ size = 16, color = '#000000', filled = false }) => {
  const fillProps = filled
    ? {
      fill: color,
    }
    : {
      stroke: color,
    }

  return (
    <svg
      width={size}
      height={size}
      viewBox='-1 -1 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='2' y='7' width='2' height='2' rx='1' {...fillProps} />
      <rect x='7' y='7' width='2' height='2' rx='1' {...fillProps} />
      <rect x='12' y='7' width='2' height='2' rx='1' {...fillProps} />
    </svg>
  )
}

export default DotStackIcon
