import React from 'react';
import ReactMarkdown from 'react-markdown';

const Markdown = ({ children }) => {
    return <ReactMarkdown source={children} />;
};

export { Markdown };
