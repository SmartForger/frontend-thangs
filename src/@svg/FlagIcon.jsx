import React from 'react'

const noop = () => null

const FlagIcon = ({ size = 16, color = '#000000', filled = true, className = '', onClick = noop }) => {
  const fillProps = filled
    ? {
      fill: color,
    }
    : {
      stroke: color,
    }

  return (
    <svg className={className} onClick={onClick} width={size} height={size} id="icon-flag" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h4v32h-4v-32z" {...fillProps} />
      <path d="M26 20.094c2.582 0 4.83-0.625 6-1.547v-16c-1.17 0.922-3.418 1.547-6 1.547s-4.83-0.625-6-1.547v16c1.17 0.922 3.418 1.547 6 1.547z" {...fillProps} />
      <path d="M19 1.016c-1.466-0.623-3.61-1.016-6-1.016-3.012 0-5.635 0.625-7 1.547v16c1.365-0.922 3.988-1.547 7-1.547 2.39 0 4.534 0.393 6 1.016v-16z" {...fillProps} />
    </svg>
  )
}

export default FlagIcon
