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
    overflow-x: hidden;
    background: ${props => props.theme.primary};
  }

  ${enablePlaceholderForContentEditable}
`;

const NewGlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Montserrat:wght@300;400;500;600;700&display=swap');

  body {
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    background: ${props => props.theme.backgroundColor};
    font-family: ${props => props.theme.buttonFont};
    font-size: 14px;
    color: ${props => props.theme.mainFontColor};
  }

  a {
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: inherit;
  }
`;

export { GlobalStyle, NewGlobalStyle };
