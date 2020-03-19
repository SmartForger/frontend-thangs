import { createGlobalStyle, css } from 'styled-components';

const enablePlaceholderForContentEditable = css`
    [contentEditable='true']:empty:before {
        content: attr(data-placeholder);
    }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Raleway');

  body {
    padding: 0;
    margin: 0;
    font-family: Raleway, sans-serif;
    overflow: hidden;
  }

  ${enablePlaceholderForContentEditable}
`;

export { GlobalStyle };
