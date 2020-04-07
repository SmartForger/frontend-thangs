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
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

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

  ${enablePlaceholderForContentEditable}
`;

export { GlobalStyle, NewGlobalStyle };
