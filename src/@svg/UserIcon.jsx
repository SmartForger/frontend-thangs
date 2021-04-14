import React from 'react'

const UserIcon = ({ size = 16, color = '#7F73FB' }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#clip0)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M8 6.4C9.32548 6.4 10.4 5.32548 10.4 4C10.4 2.67452 9.32548 1.6 8 1.6C6.67452 1.6 5.6 2.67452 5.6 4C5.6 5.32548 6.67452 6.4 8 6.4ZM8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z'
          fill={color}
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12.6 21.3684V13.6316C12.6 10.8236 10.5405 8.54737 8 8.54737C5.45949 8.54737 3.4 10.8236 3.4 13.6316V21.3684C3.4 24.1764 5.45949 26.4526 8 26.4526C10.5405 26.4526 12.6 24.1764 12.6 21.3684ZM8 7C4.68629 7 2 9.96906 2 13.6316V21.3684C2 25.0309 4.68629 28 8 28C11.3137 28 14 25.0309 14 21.3684V13.6316C14 9.96906 11.3137 7 8 7Z'
          fill={color}
        />
      </g>
      <defs>
        <clipPath id='clip0'>
          <rect width='16' height='16' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

export default UserIcon
