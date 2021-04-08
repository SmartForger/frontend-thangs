import React from 'react'

const VersionControlIcon = ({ size = 16, color = '#FFBC00' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <circle cx='11.5' cy='3' r='1.5' stroke={color} />
      <circle cx='4.5' cy='3' r='1.5' stroke={color} />
      <circle cx='4.5' cy='13' r='1.5' stroke={color} />
      <path
        d='M4.5 4V12V11.5C4.5 9.567 6.067 8 8 8V8C9.933 8 11.5 6.433 11.5 4.5V4'
        stroke={color}
        strokeWidth='1.4'
      />
    </svg>
  )
}

export default VersionControlIcon
