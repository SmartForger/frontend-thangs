import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Montserrat:wght@300;400;500;600;700&display=swap');

  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
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
    font-weight: 500;
    color: ${props => props.theme.linkText};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: inherit;
  }

  input, button, textarea {
    font-size: inherit;
    font-family: inherit;
  }

  ol, ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;
