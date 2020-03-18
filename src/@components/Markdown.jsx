import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

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

const MarkdownStyled = styled(ReactMarkdown)`
    p {
        margin: 0;

        ~ p {
            margin-top: 8px;
        }
    }
`;

const Markdown = ({ children }) => {
    return (
        <MarkdownStyled
            source={children}
            allowedTypes={allowedTypes}
            unwrapDisallowed
        />
    );
};

export { Markdown };
