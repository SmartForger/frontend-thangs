import React from 'react';
import ReactMarkdown from 'react-markdown';

const allowedTypes = [
    'link',
    'blockquote',
    'thematicBreak',
    'strong',
    'emphasis',
    'paragraph',
    'break',
    'text',
];

const Markdown = ({ children }) => {
    return (
        <ReactMarkdown
            source={children}
            allowedTypes={allowedTypes}
            unwrapDisallowed
        />
    );
};

export { Markdown };
