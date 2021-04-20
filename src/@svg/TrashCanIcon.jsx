import React from 'react'

const noop = () => null

const TrashCanIcon = ({ size = 16, color = '#000000', filled = true, className = '', onClick = noop }) => {
  const fillProps = filled
    ? {
      fill: color,
    }
    : {
      stroke: color,
    }

  return (
    <svg className={className} onClick={onClick} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 1.79999H9C9.33137 1.79999 9.6 2.06862 9.6 2.39999V2.99999H6.4V2.39999C6.4 2.06862 6.66863 1.79999 7 1.79999ZM5 2.39999C5 1.29542 5.89543 0.399994 7 0.399994H9C10.1046 0.399994 11 1.29542 11 2.39999V3H13H13.3C13.6866 3 14 3.3134 14 3.7C14 4.0866 13.6866 4.4 13.3 4.4H13V13C13 14.1046 12.1046 15 11 15H5C3.89543 15 3 14.1046 3 13V4.4H2.7C2.3134 4.4 2 4.0866 2 3.7C2 3.3134 2.3134 3 2.7 3H3H5V2.39999ZM4.4 4.4H11.6V13C11.6 13.3314 11.3314 13.6 11 13.6H5C4.66863 13.6 4.4 13.3314 4.4 13V4.4ZM7.2 6.7C7.2 6.3134 6.8866 6 6.5 6C6.1134 6 5.8 6.3134 5.8 6.7L5.8 11.3C5.8 11.6866 6.1134 12 6.5 12C6.8866 12 7.2 11.6866 7.2 11.3L7.2 6.7ZM9.5 6C9.8866 6 10.2 6.3134 10.2 6.7V11.3C10.2 11.6866 9.8866 12 9.5 12C9.1134 12 8.8 11.6866 8.8 11.3V6.7C8.8 6.3134 9.1134 6 9.5 6Z"
        {...fillProps}
      />
    </svg>
  )
}

export default TrashCanIcon
