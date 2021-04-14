import React from 'react'

const HeartIcon = ({ size = 16, color = '#F47575', filled = false }) => {
  const fillProps = filled
    ? {
      fill: color,
    }
    : {
      stroke: color,
      strokeWidth: 1.4,
    }

  return (
    <svg width={size} height={size} viewBox='-1 -1 18 18' fill='none'>
      <path
        d='M7.52889 14.867C7.67016 14.9539 7.8334 15 8 15C8.1666 15 8.32984 14.9539 8.47111 14.867C8.77867 14.678 16 10.1796 16 5.375C16 2.96263 14.0062 1 11.5556 1C10.1387 1 8.82667 1.73237 8 2.82C7.17333 1.73237 5.86133 1 4.44444 1C1.99378 1 0 2.96263 0 5.375C0 10.1796 7.22133 14.678 7.52889 14.867Z'
        {...fillProps}
      />
    </svg>
  )
}

export default HeartIcon
