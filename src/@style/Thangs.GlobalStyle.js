import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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
    color: ${props => props.theme.linkText};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: inherit;
  }

  input, button {
    font-size: inherit;
    font-family: inherit;
  }
`;
