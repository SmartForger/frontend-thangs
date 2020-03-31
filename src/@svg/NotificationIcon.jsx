import React from 'react';

const NotificationIcon = ({ className }) => {
    return (
        <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className={className}
        >
            <defs>
                <path id="a" d="M0 0h24v20H0z" />
            </defs>
            <g fill="none" fill-rule="evenodd">
                <path
                    d="M7.406 21.333C8.33 22.92 10.032 24 12 24c1.969 0 3.669-1.08 4.594-2.667H7.406z"
                    fill="#88888B"
                />
                <mask id="b" fill="#fff">
                    <use xlinkHref="#a" />
                </mask>
                <path
                    d="M4.046 17.333h15.908a7.168 7.168 0 01-2.621-5.549V8A5.339 5.339 0 0012 2.667 5.34 5.34 0 006.666 8v3.784a7.171 7.171 0 01-2.62 5.55zM24 20H0v-3.628l.912-.303A4.514 4.514 0 004 11.784V8c0-4.412 3.589-8 8-8 4.412 0 8 3.588 8 8v3.784a4.513 4.513 0 003.089 4.285l.91.303V20z"
                    fill="#88888B"
                    mask="url(#b)"
                />
            </g>
        </svg>
    );
};

export { NotificationIcon };
